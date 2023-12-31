import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet"
import ToastMessage from '@/components/blocks/ToastMessage';
import Layout from '@/components/layouts/Layout';
import {
    Link,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';
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
import { postFatoorahInvoice, postPaymentLog, postPurchase, putFatoorahInvoice } from '@/helpers/apiServices/purchases';
import swell from '@/swell/swelljs.js';
import { sendPayment, executePayment, checkPaymentStatus, initSession, callPaymentURL } from '@/fatoorah/client.js';

import Row from '@/components/sections/Row';
import LayoutLoading from '@/components/layouts/LayoutLoading';
import ButtonLoad from '@/components/blocks/ButtonLoad';
import classNames from 'classnames';
import { formatPrice } from '@/helpers/LocaleHelper';
import { Button } from '@/components/blocks/Button/Buttons';
import useXchangeRate from '@/helpers/useXchangeRate2';
import USDtoSAR from '@/helpers/USDtoSAR';

const currencyOptions = {
    rounding: 0.001
};

const Checkout = ({
    auth,
    fetchCartAction,
    cart,
    addVoucherAction,
    removeVoucherAction,
    siteLoading,
    postPurchase,
    postFatoorahInvoice,
    putFatoorahInvoice,
    postPaymentLog,
    executePayment,
    addOrderData }) => {



    const [fatoorahReady, setFatoorahReady] = useState(false);
    const [fatoorahSession, setFatoorahSession] = useState(null);
    const [fatoorahCountry, setFatoorahCountry] = useState(null);

    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    const [voucher, setVoucher] = useState('');
    const router = useRouter();
    const { query, isReady } = useRouter();
    const cardElement = useRef(null);
    const cardExpiryId = useRef(null);
    let preferredCurrency = 'SAR';//auth?.user?.profile?.currency || 'USD';

    const [processing, setProcessing] = useState(false);
    const [tokenURL, setTokenUrl] = useState('');
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

    // const { values } = useXchangeRate(
    //     [price],
    //     'USD',
    //     'SAR'
    // );

    const tokenize = async () => {
        setProcessing(true);

        myFatoorah.submit().then(
            function (response) {
                // In case of success
                // Here you need to pass session id to you backend here
                console.log(response);
                recordPaymentLog({action: 'startPayment', user: auth?.user?.id || 0, experience: experience_id, data: response})

                var sessionId = response.sessionId;
                var cardBrand = response.cardBrand; //cardBrand will be one of the following values: Master, Visa, Mada, Amex

                executePayment(auth?.user?.id || null, auth?.user?.profile?.first || null, auth?.user?.email || null, experience_id, price, title, sessionId).then((execResp) => {
                    recordPaymentLog({action: 'executePayment', user: auth?.user?.id || 0, experience: experience_id, data: execResp})

                    if (execResp.IsSuccess == true) {
                        // recordFatoorahInvoice(sessionId, experience_id, execResp.Data.InvoiceId, price);

                        // window.location.href = execResp.Data.PaymentURL;
                        var trxnInterval = setInterval(() => {
                            checkPaymentStatus(execResp.Data.InvoiceId).then((resp) => {
                                // setProcessing(false);
                                console.log(resp);
                                console.log(resp.Data.InvoiceStatus);
                                if (resp.Data.InvoiceStatus === 'Paid') {
                                    clearInterval(trxnInterval);
                                    clearInterval(otpWindowInterval);

                                    recordPaymentLog({action: 'paymentSuccess', user: auth?.user?.id || 0, experience: experience_id, data: resp})


                                    otpWindow.close();

                                    // markFatoorahInvoiceAsPaid(sessionId, experience_id, execResp.Data.InvoiceId, execResp.Data.InvoiceTransactions[0].TransactionId);
                                    placeOrder(execResp.Data.InvoiceId, resp.Data);

                                } else if (resp.Data.InvoiceStatus === 'Pending') {
                                    console.log("Waiting for payment status change ..");
                                } else {
                                    recordPaymentLog({action: 'paymentFailure', user: auth?.user?.id || 0, experience: experience_id, data: resp})

                                    pushMessage("Payment failure !, cancelling ..");
                                    setTimeout(() => {
                                        router.back();
                                    }, 2000);
                                }
                                // if (resp.Data.InvoiceStatus) {
                                // alert("Done !");
                                // } else {
                                // pushMessage("Payment failure !, cancelling ..");
                                // setTimeout(() => {
                                //     router.back();
                                // }, 2000);
                                // }
                            });
                        }, 1000);

                        let otpWindow = window.open(execResp.Data.PaymentURL, 'otp', 'height=400, width=600');
                        if (otpWindow) {
                            if (window.focus) { otpWindow.focus() }
                            var otpWindowInterval, trxnInterval;

                            otpWindowInterval = setInterval(() => {
                                if (otpWindow.closed) {
                                    recordPaymentLog({action: 'paymentFailure', user: auth?.user?.id || 0, experience: experience_id, data: {"reason": "OTP Window Closed"}})

                                    clearInterval(otpWindowInterval);
                                    clearInterval(trxnInterval);
                                    setProcessing(false);
                                    pushMessage("OTP failure !, cancelling ..");
                                    setTimeout(() => {
                                        router.back();
                                    }, 2000);
                                }
                            }, 500);
                        } else {
                            setTokenUrl(execResp.Data.PaymentURL)
                        }
                    } else {
                        pushMessage(execResp.Message);
                    }


                }).catch((error) => {
                    console.log(error);
                    pushMessage(error);
                    setProcessing(false);
                })
            },
            function (error) {
                // In case of errors
                console.log(error);
                pushMessage(error);
                setProcessing(false);
            }
        );

        // var paymentURL = await sendPayment(auth?.user?.id || null, auth?.user?.profile?.first || null, auth?.user?.email || null, experience_id, price, title);

        // window.location.href = paymentURL;

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

    const recordPaymentLog = async(data) => {
        postPaymentLog(data).then((res) => {
            console.log(res);
        })
    }

    const recordFatoorahInvoice = async (session_id, experience_id, invoice_id, amount) => {
        console.log("recordFatoorahInvoice", { session_id, experience_id, invoice_id, amount });

        postFatoorahInvoice({
            user: auth.user.id,
            session_id: String(session_id),
            experience: String(experience_id),
            invoice_id: String(invoice_id),
            amount: String(amount),
            status: 'Pending',
            transaction_id: '0',
        }).then((res) => {
            console.log("recordFatoorahInvoice", res);
        });
    }

    const markFatoorahInvoiceAsPaid = async (session_id, experience_id, invoice_id, transaction_id) => {
        console.log("markFatoorahInvoiceAsPaid", { session_id, experience_id, invoice_id, transaction_id });

        putFatoorahInvoice({
            session_id: String(session_id),
            invoice_id: String(invoice_id)
        }, {
            status: 'Paid',
            transaction_id: String(transaction_id)
        }).then((res) => {
            console.log("markFatoorahInvoiceAsPaid", res);
        });
    }

    const placeOrder = async (fatoorah_invoice_id, payment) => {
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
                fatoorah_invoice_id,
                order: order,
                payment,
                // swell_orderId: order.id,
                experience_id,
                publish_id,
                experience: publish_id,
                title,
                type,
                featured_image,
                ...guidedData
            }).then((res) => {
                addOrderData({ payment, order, product });
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
    // useEffect(() => {
    //     if (isReady && !loadingCart) {
    //         swell.payment.createElements({
    //             card: {
    //                 elementId: cardElement.current, // default: #card-element
    //                 separateElements: false, // required for separate elements

    //                 cardExpiry: {
    //                     elementId: cardExpiryId.current, // default: #cardExpiry-element
    //                     options: {
    //                         // options are passed as a direct argument to stripe.js
    //                         style: {
    //                             base: {
    //                                 fontWeight: 500,
    //                                 fontSize: '32px',
    //                                 color: 'blue'
    //                             }
    //                         }
    //                     }
    //                 },
    //                 // cardCvc: {
    //                 // elementId: '#card-expiry-id' // default: #cardCvc-element
    //                 // },
    //                 options: {
    //                     // options are passed as a direct argument to stripe.js
    //                     style: {
    //                         base: {
    //                             fontWeight: 500,
    //                             fontSize: '16px'
    //                         }
    //                     }
    //                 },
    //                 onChange: (event) => {
    //                     // optional, called when the Element value changes
    //                 },
    //                 onReady: (event) => {
    //                     // optional, called when the Element is fully rendered
    //                 },
    //                 onFocus: (event) => {
    //                     // optional, called when the Element gains focus
    //                 },
    //                 onBlur: (event) => {
    //                     // optional, called when the Element loses focus
    //                 },
    //                 onEscape: (event) => {
    //                     // optional, called when the escape key is pressed within an Element
    //                 },
    //                 onClick: (event) => {
    //                     // optional, called when the Element is clicked
    //                 },
    //                 onSuccess: (result) => {
    //                     // optional, called on card payment success
    //                 },
    //                 onError: (error) => {
    //                     // optional, called on card payment error
    //                 }
    //             }
    //         });
    //     }
    // }, [loadingCart]);

    useEffect(() => {
        let cartListener = null;
        fetchCartAction().then(() => {
            setLoadingCart(false);
            cartListener = window.addEventListener('storage', reloadCart);
        });

        return () => window.removeEventListener('storage', cartListener);
    }, []);

    const [priceHistory, setPriceHistory] = useState(null)

    useEffect(() => {
        // setTimeout(() => {

            // console.log("priceHistory", priceHistory)
            console.log("price", price)

            // if(!(price !== priceHistory && priceHistory !== null)) {
            //     setPriceHistory(price)
            //     return;
            // }

            if (fatoorahReady)
                return;

            setFatoorahReady(true);

            const [SAR_price] = USDtoSAR([price])
            console.log(SAR_price)

            if (!auth.user)
                router.back();

            if (typeof window.OTPResult == 'undefined') {
                window.OTPResult = (res) => {
                    console.log(res);
                }
            }

            var fatoorahInit = false;

            

            initSession(auth.user.id).then((resp) => {
                recordPaymentLog({action: 'session', user: auth?.user?.id || 0, experience: experience_id, data: resp})

                var fatoorahInterval = setInterval(() => {
                    console.log('fatoorah interval')
                    if (fatoorahInit)
                        return;

                    setFatoorahSession(resp.SessionID);
                    setFatoorahCountry(resp.CountryCode);

                    console.log(resp.SessionID);

                    // let fatoorahInterval = setInterval(() => {
                    //     if(fatoorahInit) {
                    //         clearInterval(fatoorahInterval);
                    //         return;
                    //     }

                    if (document.getElementById('card-element')) {
                        document.getElementById('card-element').style.display = 'none';

                        loadFatoorahForm(resp.SessionID, resp.CountryCode);
                        fatoorahInit = true;
                        clearInterval(fatoorahInterval);

                        if (!window.ApplePaySession) {
                            document.querySelector('div#fatoorah-ap').style.display = 'none';
                        }

                        if (window.ApplePaySession && !document.querySelector('#fatoorah-ap > iframe'))
                            loadAPForm(resp.SessionID, resp.CountryCode, SAR_price, 'SAR', (paymentData) => {
                                setProcessing(true);
                                
                                console.log('payment', paymentData);

                                recordPaymentLog({action: 'startPayment', user: auth?.user?.id || 0, experience: experience_id, data: paymentData})

                                var sessionId = paymentData.sessionId;
                                var cardBrand = paymentData.cardBrand; //cardBrand will be one of the following values: Master, Visa, Mada, Amex

                                executePayment(auth?.user?.id || null, auth?.user?.profile?.first || null, auth?.user?.email || null, experience_id, price, title, sessionId).then((execResp) => {
                                    recordPaymentLog({action: 'executePayment', user: auth?.user?.id || 0, experience: experience_id, data: execResp})

                                    if (execResp.IsSuccess == true) {
                                        // recordFatoorahInvoice(sessionId, experience_id, execResp.Data.InvoiceId, price);

                                        // window.location.href = execResp.Data.PaymentURL;
                                        callPaymentURL(execResp.Data.PaymentURL);

                                        var otpWindowInterval, trxnInterval;
                                        trxnInterval = setInterval(() => {
                                            checkPaymentStatus(execResp.Data.InvoiceId).then((resp) => {
                                                // setProcessing(false);
                                                console.log(resp);
                                                console.log(resp.Data.InvoiceStatus);
                                                if (resp.Data.InvoiceStatus === 'Paid') {
                                                    recordPaymentLog({action: 'paymentSuccess', user: auth?.user?.id || 0, experience: experience_id, data: resp})

                                                    clearInterval(trxnInterval);
                                                    clearInterval(otpWindowInterval);

                                                    // otpWindow.close();
                                                    // markFatoorahInvoiceAsPaid(sessionId, experience_id, execResp.Data.InvoiceId, execResp.Data.InvoiceTransactions[0].TransactionId);
                                                    placeOrder(execResp.Data.InvoiceId, resp.Data);

                                                } else if (resp.Data.InvoiceStatus === 'Pending') {
                                                    console.log("Waiting for payment status change ..");
                                                } else {
                                                    recordPaymentLog({action: 'paymentFailure', user: auth?.user?.id || 0, experience: experience_id, data: resp})

                                                    pushMessage("Payment failure !, cancelling ..");
                                                    setTimeout(() => {
                                                        router.back();
                                                    }, 2000);
                                                }
                                                // if (resp.Data.InvoiceStatus) {
                                                // alert("Done !");
                                                // } else {
                                                // pushMessage("Payment failure !, cancelling ..");
                                                // setTimeout(() => {
                                                //     router.back();
                                                // }, 2000);
                                                // }
                                            });
                                        }, 1000);
                                        if (0 && execResp.Data.PaymentURL) {
                                            let otpWindow = window.open(execResp.Data.PaymentURL, 'otp', 'height=400, width=600');
                                            if (otpWindow) {
                                                if (window.focus) { otpWindow.focus() }
                                                otpWindowInterval = setInterval(() => {
                                                    if (otpWindow.closed) {
                                                        recordPaymentLog({action: 'paymentFailure', user: auth?.user?.id || 0, experience: experience_id, data: {"reason": "OTP Window Closed"}})

                                                        clearInterval(otpWindowInterval);
                                                        clearInterval(trxnInterval);
                                                        setProcessing(false);
                                                        pushMessage("OTP failure !, cancelling ..");
                                                        setTimeout(() => {
                                                            router.back();
                                                        }, 2000);
                                                    }
                                                }, 500);
                                            }
                                        }
                                    } else {
                                        pushMessage(execResp.Message);
                                    }


                                }).catch((error) => {
                                    recordPaymentLog({action: 'paymentError', user: auth?.user?.id || 0, experience: experience_id, data: {"reason": error}})

                                    console.log(error);
                                    pushMessage(error);
                                    setProcessing(false);
                                })
                            }, () => {
                                console.log('sessionStart');
                            }, () => {
                                console.log('sessionEnd');
                            })

                        // fatoorahInit = true;

                        setTimeout(() => {
                            document.getElementById('card-element').style.display = 'block';

                            document.getElementById('card-element').style.height = '150px';
                            document.getElementsByName('iframeCardView')[0].style.height = '200px';
                        }, 500);

                        // clearInterval(fatoorahInterval);
                    }
                    // }, 1000);

                }, 2000);

            }).catch((err) => {
                console.log(Error, err);
            });

            return () => {
                if (document.getElementById('card-element'))
                    document.getElementById('card-element').innerHTML = '';

                delete window.OTPResult;
            }

        // }, 1000);
    }, [auth, price]);

    useEffect(() => {
        if (!siteLoading) {
            if (!auth.isAuthenticated) {
                updateCartAction([]); // reset cart and leave page
                router.replace('/');
            }
        }
    }, [siteLoading, auth]);


    return (
        <>

            <Layout>
                {!loadingCart && type ? (
                    <div
                        style={{ display: processing ? 'none' : 'block' }}
                        className={` mb-12a mt-12 lg:mt-12 mx-auto px-5 md:px-9 lg:px-12 xl:px-241 2xl:px-401 xl:max-w-7xl d-hdpi-2:max-w-screen-2/3 d-hdpi-2:px-vw-9 d-hdpi-2:mt-vw-12 d-hdpi-2:text-vw-base`}>
                        <div className={``}>
                            <div className="inline-block text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-green-400 to-green-400 font-bold text-3xl tracking-tight leading-none pb-8 d-hdpi-2:text-vw-3xl d-hdpi-2:pb-vw-8">
                                Checkout
                            </div>
                        </div>
                        <main
                            className={classNames(
                                processing ? 'hidden' : 'flex',
                                'items-start lg:gap-16 xl:gap-24 flex-col lg:flex-row d-hdpi-2:gap-12'
                            )}>
                            <section
                                className={classNames(
                                    'w-full lg:w-3/5 lg:mb-24'
                                )}>
                                {type == 'GUIDED' && (
                                    <>
                                        <ExpSubsection
                                            padding="pb-8 d-hdpi-2:pb-vw-8"
                                            margins="mb-8 d-hdpi-2:mb-vw-8">
                                            <div className="text-green-400 text-2xl font-bold mb-4 d-hdpi-2:text-vw-2xl d-hdpi-2:mb-vw-4">
                                                Your booking
                                            </div>
                                            <div className="flex flex-col gap-4 d-hdpi-2:gap-2">
                                                <div className="flex flex-col gap-1 d-hdpi-2:gap-0.5">
                                                    <div className="font-bold">
                                                        Date
                                                    </div>
                                                    <div>
                                                        {moment(
                                                            travel_date
                                                        ).format(
                                                            'MMMM Do YYYY'
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </ExpSubsection>

                                        <ExpSubsection
                                            padding="pb-8 d-hdpi-2:pb-vw-8"
                                            margins="mb-8 d-hdpi-2:mb-vw-8">
                                            <div className="text-green-400 text-2xl font-bold mb-4 d-hdpi-2:text-vw-2xl d-hdpi-2:mb-vw-4">
                                                Guest info
                                            </div>
                                            <div>
                                                Lorem ipsum, dolor sit amet
                                                consectetur adipisicing elit.
                                                Cumque culpa ipsam ducimus ullam
                                                consequatur exercitationem,
                                                atque ratione officia autem
                                                temporibus.
                                            </div>
                                        </ExpSubsection>
                                    </>
                                )}
                                <ExpSubsection
                                    padding="pb-8 d-hdpi-2:pb-vw-8"
                                    margins="mb-8 d-hdpi-2:mb-vw-8">
                                    <div className="text-green-400 text-2xl font-bold mb-4 d-hdpi-2:text-vw-2xl d-hdpi-2:mb-vw-4">
                                        Summary
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: description
                                        }}
                                    />
                                </ExpSubsection>

                                {/* <ExpSubsection
                                    padding="pb-8 d-hdpi-2:pb-vw-8"
                                    margins="mb-8 d-hdpi-2:mb-vw-8">
                                    <div className="text-green-400 text-2xl font-bold mb-4 d-hdpi-2:text-vw-2xl d-hdpi-2:mb-vw-4">
                                        Payment info
                                    </div>
                                     <div>
                                        <div
                                            id="card-element-id"
                                            ref={cardElement}></div>
                                        <div
                                            id="card-expiry-id"
                                            ref={cardExpiryId}></div>
                                         <div  id="card-number-id"></div> 
                                    </div>  





                                </ExpSubsection> */}
                            </section>

                            <aside
                                className={classNames(
                                    'w-full lg:w-2/5 lg:stickya lg:top-12a py-4 lg:pb-24 d-hdpi-2:pb-vw-24'
                                )}>
                                <div
                                    className={`flex flex-col px-4 xl:px-8 pt-4 pb-4  xl:pb-8 xl:pt-8 bg-kn-white rounded-2xl shadow-cards d-hdpi-2:px-vw-8 d-hdpi-2:py-vw-8 d-hdpi-2:rounded-vw-2xl`}>
                                    <div className="flex flex-col md:flex-row gap-4 border-b border-green-600 border-opacity-20 pb-6 d-hdpi-2:pb-vw-6">
                                        <div className="md:w-32 overflow-hidden rounded-lg d-hdpi-2:w-vw-32 d-hdpi-2:rounded-vw-lg">
                                            <img
                                                alt=""
                                                className="object-cover object-center w-full h-full"
                                                data-blink-src={featured_image}
                                            />
                                        </div>
                                        <div>
                                            <div className="border-b border-green-600 border-opacity-20 pb-2 d-hdpi-2:pb-vw-2">
                                                <div className="text-sm d-hdpi-2:text-vw-sm">
                                                    {title}
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center font-sans text-xs text-gray-900 d-hdpi-2:mt-vw-2 d-hdpi-2:text-vw-xs">
                                                    <div className="flex  mr-8 py-1 d-hdpi-2:mr-vw-8 d-hdpi-2:py-vw-1">
                                                        <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                                                            <i className="ri-map-pin-line text-xl d-hdpi-2:text-vw-xl"></i>
                                                        </span>

                                                        <span className="flex flex-wrap items-center">
                                                            {destinations?.length >
                                                                0 ? (
                                                                destinations.map(
                                                                    (
                                                                        item,
                                                                        index,
                                                                        itemArray
                                                                    ) => {
                                                                        return (
                                                                            <span
                                                                                key={`${item}_${index}`}>
                                                                                <span className="whitespace-nowrap">
                                                                                    {
                                                                                        item
                                                                                        /* {country(
                                                                                    'en',
                                                                                    item.code
                                                                                )} */
                                                                                    }
                                                                                </span>
                                                                                {index <
                                                                                    itemArray.length -
                                                                                    1 && (
                                                                                        <span className="px-1 d-hdpi-2:px-vw-1">
                                                                                            .
                                                                                        </span>
                                                                                    )}
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <span className="w-20 bg-gray-300 rounded-full h-2 d-hdpi-2:w-vw-20 d-hdpi-2:h-vw-2" />
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mr-8 py-1 d-hdpi-2:mr-vw-8 d-hdpi-2:py-vw-1">
                                                        <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                                                            <i className="ri-time-line text-xl d-hdpi-2:text-vw-xl"></i>
                                                        </span>
                                                        {pluralize(days, 'Day')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs mt-4 flex flex-wrap gap-x-1 d-hdpi-2:text-vw-xs d-hdpi-2:mt-vw-4 d-hdpi-2:gap-x-0.5">
                                                <span>
                                                    {`A ${capitalize(
                                                        type
                                                    )} Experience by`}
                                                </span>
                                                <span className="underline font-semibold text-green-700">
                                                    {`${kreatorName({
                                                        username,
                                                        first
                                                    })}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {coupon && !loadingCoupon ? (
                                        <div className="border-b border-green-600 border-opacity-20  py-6 pb-4 d-hdpi-2:py-vw-6 d-hdpi-2:pb-vw-4">
                                            <div>
                                                <span>{coupon.name}</span>
                                                <button
                                                    style={{ float: 'right' }}
                                                    onClick={removeCoupon}>
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="flex justify-between gap-2 mt-4 d-hdpi-2:gap-1 d-hdpi-2:mt-vw-4">
                                        <Block__InputSingle
                                            responsive={true}
                                            whiteBg={false}
                                            normal
                                            error={false}
                                            handleChange={(e) =>
                                                setVoucher(e.target.value)
                                            }
                                            id="first"
                                            margins=""
                                            value={voucher}
                                            placeholder={'Coupon code'}
                                            // rtl={rtl}
                                            height="h-10 d-hdpi-2:h-vw-10"
                                            fontSize="text-sm d-hdpi-2:text-vw-sm"
                                            label=""
                                            labelPos="left"
                                            labelJustify="text-right mr-2 d-hdpi-2:mr-vw-2"
                                            labelMargin=""
                                            labelWidth="w-32 d-hdpi-2:w-vw-32"
                                            flex="flex-1"
                                        />
                                        <ButtonLoad
                                            handleClick={addVoucher}
                                            isLoading={loadingCoupon}
                                            label="Add"
                                            margins=""
                                            width="w-20 d-hdpi-2:w-vw-20"
                                            height="h-10 d-hdpi-2:h-vw-10"
                                            animation={false}
                                        />
                                    </div>

                                    <div className="border-b border-green-600 border-opacity-20  py-6 pb-4 d-hdpi-2:py-vw-6 d-hdpi-2:pb-vw-4">
                                        <div className="flex flex-col rounded-xl bg-kn-gray-100 px-4 lg:px-8 py-4 d-hdpi-2:px-vw-8 d-hdpi-2:py-vw-4 d-hdpi-2:rounded-vw-xl ">
                                            <div className=" mb-4 font-semibold d-hdpi-2:mb-vw-4">
                                                Price details
                                            </div>
                                            <div className="flex flex-col gap-2 d-hdpi-2:gap-1">
                                                <div className="flex text-xs items-center justify-between  pb-2 border-b-2 border-gray-300 border-dotted d-hdpi-2:text-vw-xs d-hdpi-2:pb-vw-2 d-hdpi-2:border-b">
                                                    <span className="relative">
                                                        Price
                                                    </span>
                                                    <span className="relative">
                                                        {formatPrice(
                                                            price,
                                                            'USD',
                                                            window.navigator
                                                                .language,
                                                            currencyOptions,
                                                            undefined,
                                                            '$US '
                                                        )}
                                                    </span>
                                                </div>

                                                {type.toLowerCase() ===
                                                    'guided' && (
                                                        <div className="flex flex-col gap-2 border-b-2 pb-2 border-gray-300 border-dotted d-hdpi-2:gap-1 d-hdpi-2:border-b d-hdpi-2:pb-vw-2">
                                                            <div className="flex text-xs items-center justify-between d-hdpi-2:text-vw-xs">
                                                                <span className="relative">
                                                                    people
                                                                </span>
                                                                <span className="relative">
                                                                    {people}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                {coupon && !loadingCoupon ? (
                                                    <div className="border-b-2 border-gray-300 border-dotted pb-2 d-hdpi-2:border-b d-hdpi-2:pb-vw-2">
                                                        <div className="flex text-sm font-semibold items-center justify-between pt-2 d-hdpi-2:text-vw-sm d-hdpi-2:pt-vw-2">
                                                            <span className="flex">
                                                                <span className="relative">
                                                                    Subtotal
                                                                </span>
                                                            </span>
                                                            <span className="flex">
                                                                <span className="relative">
                                                                    {formatPrice(
                                                                        sub_total,
                                                                        'USD',
                                                                        window
                                                                            .navigator
                                                                            .language,
                                                                        currencyOptions,
                                                                        undefined,
                                                                        '$US '
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="flex text-sm font-semibold items-center justify-between pt-2 d-hdpi-2:text-vw-sm d-hdpi-2:pt-vw-2">
                                                            <span className="flex">
                                                                <span className="relative">
                                                                    Discount
                                                                </span>
                                                            </span>
                                                            <span className="flex">
                                                                <span className="relative">
                                                                    {formatPrice(
                                                                        discount_total,
                                                                        'USD',
                                                                        window
                                                                            .navigator
                                                                            .language,
                                                                        currencyOptions,
                                                                        undefined,
                                                                        '$US '
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="flex text-sm font-semibold items-center justify-between pt-2 d-hdpi-2:text-vw-sm d-hdpi-2:pt-vw-2">
                                                    <span className="flex">
                                                        <span className="relative">
                                                            Total
                                                        </span>
                                                        {/* {preferredCurrency !=
                                                        'USD' && (
                                                        <span className="text-xs">
                                                            *
                                                        </span>
                                                    )} */}
                                                    </span>
                                                    <span className="flex">
                                                        <span className="relative">
                                                            {formatPrice(
                                                                grand_total,
                                                                'USD',
                                                                window.navigator
                                                                    .language,
                                                                currencyOptions,
                                                                undefined,
                                                                '$US '
                                                            )}
                                                        </span>
                                                        {/* {preferredCurrency !=
                                                        'USD' && (
                                                        <span className="text-xs">
                                                            **
                                                        </span>
                                                    )}*/}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {preferredCurrency !== 'USD' && (
                                            <div className="px-2 mt-4 d-hdpi-2:px-vw-2 d-hdpi-2:mt-vw-4">
                                                <div className="flex items-center gap-1 text-xs d-hdpi-2:text-vw-xs d-hdpi-2:gap-0.5">
                                                    {/* <div className="">
                                                        * 1 USD ~{' '}
                                                    </div> */}
                                                    {/* <span>
                                                        {formatPrice(
                                                            rate,
                                                            'USD',
                                                            getBrowserLocale(),
                                                            currencyOptions
                                                        )}
                                                    </span> */}
                                                    <div className="">
                                                        {/* {preferredCurrency} */}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs d-hdpi-2:gap-0.5 d-hdpi-2:text-vw-xs">
                                                    <div className="">
                                                        ** You will be charged
                                                    </div>
                                                    {/* <div className="">$US</div> */}
                                                    <span>
                                                        {formatPrice(
                                                            grand_total,
                                                            'USD',
                                                            window.navigator
                                                                .language,
                                                            currencyOptions,
                                                            undefined,
                                                            '$US '
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="px-2 mt-4 text-xs d-hdpi-2:px-vw-2 d-hdpi-2:mt-vw-4 d-hdpi-2:text-vw-xs">
                                            Charges will appear as {`${process.env.NEXT_PUBLIC_FATOORAH_MERCHANT_NAME}`}
                                        </div>
                                    </div>
                                    <div className="border-b border-green-600 border-opacity-20  py-4 d-hdpi-2:py-vw-4">
                                        <div className="px-2 text-xs d-hdpi-2:px-vw-2 d-hdpi-2:text-vw-xs">
                                            To learn about our cancellation and
                                            refund policy{' '}
                                            <a
                                                className="underline font-semibold text-green-700"
                                                target="_blank"
                                                href={`${process.env.NEXT_PUBLIC_URL}/help/article/4002`}>
                                                click here
                                            </a>
                                        </div>
                                    </div>

                                    <div id="card-element" style={{ marginTop: '5px', width: '100%' }}></div>


                                    <div className="h-full flex items-center flex-col justify-between">
                                        <ButtonLoad
                                            handleClick={tokenize}
                                            isLoading={false}
                                            label="Confirm and Pay"
                                            width="w-full"
                                        // handleClick={handleSubmit}
                                        // form="paymentForm"
                                        // type="submit"
                                        />
                                        <div style={{ marginTop: '10px', width: '100%' }} id="fatoorah-ap"></div>

                                        {/* <button onClick={tokenize}>
                                            Submit
                                        </button> */}
                                    </div>
                                </div>
                            </aside>
                        </main>
                    </div>
                ) : (
                    <LayoutLoading
                        message="Preparing checkout"
                        bg="bg-gray-50"
                    />
                )}
                {processing ? (
                    tokenURL.length == 0 ? (
                        <LayoutLoading bg="bg-gray-50">
                            <div className="flex flex-col items-center max-w-2xl text-center mt-6 text-sm d-hdpi-2:text-vw-sm d-hdpi-2:mt-vw-6 d-hdpi-2:max-w-screen-1/3 uppercase tracking-wide text-gray-600">
                                <div>Processing order...</div>
                                <div>
                                    Don't close this page. You will be redirected to
                                    your purchases page once the processing
                                    completes.
                                </div>
                            </div>
                        </LayoutLoading>) : (
                        <LayoutLoading bg="bg-gray-50">
                            <div className="flex flex-col items-center max-w-2xl text-center mt-6 text-sm d-hdpi-2:text-vw-sm d-hdpi-2:mt-vw-6 d-hdpi-2:max-w-screen-1/3 uppercase tracking-wide text-gray-600">
                                <div>OTP is Required</div>
                                <div>
                                    <Button handleClick={() => {
                                        let otpWindow = window.open(tokenURL, 'otp', 'height=400, width=600');
                                        if (otpWindow) {
                                            if (window.focus) { otpWindow.focus() }
                                            var otpWindowInterval;

                                            otpWindowInterval = setInterval(() => {
                                                if (otpWindow.closed) {
                                                    clearInterval(otpWindowInterval);
                                                    clearInterval(trxnInterval);
                                                    setProcessing(false);
                                                    pushMessage("OTP failure !, cancelling ..");
                                                    setTimeout(() => {
                                                        router.back();
                                                    }, 2000);
                                                }
                                            }, 500);
                                        } else {
                                            alert("Error showing OTP window, please make sure popups are allowed by your browser.")
                                        }
                                    }}>Please click here to open the OTP window</Button>
                                </div>
                            </div>
                        </LayoutLoading>
                    )
                ) : null}
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
    user: state.user,
    executePayment
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
            postFatoorahInvoice,
            putFatoorahInvoice,
            addOrderData,
            postPaymentLog,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
