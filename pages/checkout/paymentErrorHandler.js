import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import ToastMessage from '@/components/blocks/ToastMessage';
import Layout from '@/components/layouts/Layout';
import {
    fetchCartAction,
    updateCartAction,
    addVoucherAction,
    removeVoucherAction
} from '@/store/actions/swell/cart';
import { addOrderData } from '@/store/actions/order';
import { convertVariantNameDateToIso } from '@/helpers/calander';
import ExpSubsection from '@/components/sections/ExpSubsection';
import moment from 'moment';
import { capitalize, kreatorName, pluralize } from '@/helpers/FEutils';
import { User, Clock, MapPin, Users, Layers } from 'lucide-react';
import { submitPayment, clearPaymentErrors } from '@/store/actions/payment';
import { Block__InputSingle } from 'components/blocks/Blocks';
import PageSpinner from '@/components/blocks/PageSpinner';
import { postPurchase } from '@/helpers/apiServices/purchases';
import swell from '@/swell/swelljs.js';
import { sendPayment, checkPaymentStatus } from '@/fatoorah/client.js';

import Row from '@/components/sections/Row';
import LayoutLoading from '@/components/layouts/LayoutLoading';
import ButtonLoad from '@/components/blocks/ButtonLoad';
import classNames from 'classnames';
import { formatPrice } from '@/helpers/LocaleHelper';

const currencyOptions = {
    rounding: 0.001
};

const PaymentErrorHandler = ({
    auth,
    fetchCartAction,
    cart,
    addVoucherAction,
    removeVoucherAction,
    siteLoading,
    postPurchase,
    addOrderData }) => {
    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    const [voucher, setVoucher] = useState('');
    const router = useRouter();
    const { query, isReady } = useRouter();
    const cardElement = useRef(null);
    const cardExpiryId = useRef(null);
    let preferredCurrency = 'SAR'; //auth?.user?.profile?.currency || 'USD';

    const [processing, setProcessing] = useState(false);
    const { coupon, sub_total, grand_total, discount_total } = cart;
    const parseCart = () => {
        const { digital, guided } = cart;
        const type = Object.keys(digital).length
            ? 'DIGITAL'
            : Object.keys(guided).length
                ? 'GUIDED'
                : null;
        const product = {
            type,
            title: '',
            description: '',
            featured_image: '',
            destinations: [],
            days: 0,
            username: '',
            first: '',
            price: 0,
            people: 0,
            travel_date: '',
            publish_id: '',
            experience_id: ''
        };

        if (!type) {
            return { type };
        }

        if (type === 'GUIDED') {
            const guidedItems = guided[Object.keys(guided)[0]];
            const item = guidedItems[Object.keys(guidedItems)[0]];

            const {
                price = 0,
                quantity = 0,
                variant: { name },
                product: {
                    name: title = '',
                    description = '',
                    content: {
                        featured_image = '',
                        destinations = [],
                        days = 0,
                        username = '',
                        first = '',
                        publish_id,
                        experience_id
                    }
                }
            } = item;

            product['featured_image'] = featured_image;
            product['destinations'] = destinations;
            product['days'] = days;
            product['title'] = title;
            product['username'] = username;
            product['first'] = first;
            product['description'] = description;
            product['price'] = price;
            product['people'] = quantity;
            product['publish_id'] = publish_id;
            product['experience_id'] = experience_id;
            product['travel_date'] = convertVariantNameDateToIso(name);
        }

        if (type === 'DIGITAL') {
            const {
                price = 0,
                people = 0,
                product: {
                    name: title = '',
                    description = '',
                    content: {
                        featured_image = '',
                        destinations = [],
                        days = 0,
                        username = '',
                        first = '',
                        publish_id,
                        experience_id
                    }
                }
            } = digital[Object.keys(digital)[0]];

            product['featured_image'] = featured_image;
            product['destinations'] = destinations;
            product['days'] = days;
            product['title'] = title;
            product['username'] = username;
            product['first'] = first;
            product['description'] = description;
            product['price'] = price;
            product['publish_id'] = publish_id;
            product['experience_id'] = experience_id;
            product['people'] = people;
        }

        return product;
    };
    const product = useRef(parseCart());
    const {
        type,
        featured_image,
        destinations,
        days,
        title,
        username,
        first,
        description,
        price,
        people,
        travel_date,
        publish_id,
        experience_id
    } = product.current;
    const reloadCartTimeoutId = useRef(null);
    const reloadCart = () => {
        // When local storage changes, dump the list to
        // It means cart updated reload cart
        clearTimeout(reloadCartTimeoutId.current);
        if (
            window.localStorage.getItem('xx') !== JSON.stringify(cart) &&
            !loadingCart
        ) {
            reloadCartTimeoutId.current = setTimeout(() => {
                setLoadingCart(true);
                fetchCartAction().then(() => {
                    setLoadingCart(false);
                });
            }, 1000);
        }
    };

    const tokenize = async () => {
        setProcessing(true);

        var paymentURL = await sendPayment(auth?.user?.id || null, auth?.user?.profile?.first || null, auth?.user?.email || null, experience_id, price, title);

        window.location.href=paymentURL;

        // placeOrder();
        // console.log(err);
        // setProcessing(false);
        // pushMessage(err);

        // await swell.payment.tokenize({
        //     card: {
        //         onSuccess: () => {
        //             placeOrder();
        //         },
        //         onError: (err) => {
        //             setProcessing(false);
        //             pushMessage(err);
        //         }
        //     }
        // });


    };

    const placeOrder = async () => {
        try {
            await swell.cart.update({
                account: {
                    email: auth?.user?.email || 'subscription@viakonnect.com'
                }
            });

            const order = await swell.cart.submitOrder();
            const guidedData = {};

            if (type == 'GUIDED') {
                guidedData.people = people;
                guidedData.travel_date = travel_date;
            }

            postPurchase({
                user: auth.user.id,
                swell_orderId: order.id,
                experience_id,
                publish_id,
                experience: publish_id,
                title,
                type,
                featured_image,
                ...guidedData
            }).then((res) => {
                addOrderData({ order, product });
                router.push('/thanks');
            });
        } catch (err) {
            setProcessing(false);
            pushMessage(err);
        }
    };

    const removeCoupon = () => {
        setLoadingCoupon(true);
        removeVoucherAction().then(() => {
            setLoadingCoupon(false);
            pushMessage('Coupon successfully removed');
        });
    };

    const pushMessage = (msg) => {
        let message = '';
        let icon = '😕';

        if (typeof msg === 'object') {
            message = msg?.message || 'Error';
        } else {
            icon = '😊';
            message = msg;
        }
        toast.success(
            <ToastMessage icon={icon} msg={message} alignTop={false} />,
            {
                hideProgressBar: true,
                autoClose: 2500
            }
        );
    };

    const addVoucher = () => {
        setLoadingCoupon(true);
        addVoucherAction(voucher).then((res) => {
            setLoadingCoupon(false);
            if (res instanceof Error) {
                removeVoucherAction();
                pushMessage(res);
            } else {
                pushMessage('Coupon successfully applied');
            }
            setVoucher('');
        });
    };
    

    return (
        <>
            <Layout>
                (
                    <LayoutLoading bg="bg-gray-50">
                        <div className="flex flex-col items-center max-w-2xl text-center mt-6 text-sm d-hdpi-2:text-vw-sm d-hdpi-2:mt-vw-6 d-hdpi-2:max-w-screen-1/3 uppercase tracking-wide text-gray-600">
                            <div>Sorry</div>
                            <div>
                                Your payment didn't go through.<br />
                                Please expect a refund for any deducted amounts within 72 hours.
                            </div>
                        </div>
                    </LayoutLoading>
                )
            </Layout>
        </>
    );
};

const mapStateToProps = (state) => ({
    siteLoading: state.globalState.siteData.loading,
    globalState: state.globalState,
    payment: state.payment,
    auth: state.auth,
    cart: state.cart,
    user: state.user
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            submitPayment,
            clearPaymentErrors,
            fetchCartAction,
            addVoucherAction,
            removeVoucherAction,
            postPurchase,
            addOrderData
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentErrorHandler);
