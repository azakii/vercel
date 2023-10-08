import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import { toggleAuthModal, setAuthPage } from '@/store/actions/globalState';
import {
    NEXT_PUBLIC_BYPASS,
    NEXT_PUBLIC_BYPASS_LIST
} from '@/constants/public';
import {
    fetchCartAction,
    postCartAction,
    updateCartAction,
    removeFromCartAction,
    updateItemCartAction,
    removeVoucherAction
} from '@/store/actions/swell/cart';
import { addOrderData } from '@/store/actions/order';
import { postPurchaseBypass } from '../../helpers/apiServices/purchases';
import translations from 'constants/translations';
import BuyingCardDigital from './BuyingCardDigital';
import BuyingCardGuide from './BuyingCardGuide';
import ModalGenericWithoutAuth from '@/blocks/Modal/ModalGenericWithoutAuth';
import GenericBtn from '../blocks/Map/GenericBtn';
import Button from 'components/blocks/Button/Button';
import { emptyCart } from '@/swell/api/cart';

function SectionPricingBooking({
    mobile,
    type,
    expId,
    pubId,
    swellExpId,
    globalState: { lang, edit },
    auth,
    fetchCartAction,
    postCartAction,
    updateCartAction,
    removeFromCartAction,
    updateItemCartAction,
    removeVoucherAction,
    postPurchaseBypass,
    setAuthPage,
    toggleAuthModal,
    handlePanelClick,
    session: { ip: { countryCode } } = { ip: { countryCode: 'US' } },
    processing,
    addOrderData
}) {
    const rtl = !!translations[lang].rtl;
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bypassModalState, setBypassModalState] = useState(false);
    const router = useRouter();
    const { isReady } = useRouter();
    const getPrice = async (type) => {
        const isguided = type.toLowerCase() === 'guided';
        const response = await fetch(
            `/api/price/${isguided ? swellExpId : expId}?type=${type}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = await response.json();

        setProductData(isguided ? data.results : data.results[0]);
        setLoading(false);
    };

    const removeProdFromCart = (cartId) => {
        setLoading(true);
        updateCartAction([]).then((dd) => {
            setLoading(false);
        });
    };

    const addDigitalProdToCart = (prodId) => {
        if (!auth.isAuthenticated || !auth.isProfile) {
            if (auth.isAuthenticated) {
                setAuthPage('profile');
            } else {
                setAuthPage('login');
            }
            toggleAuthModal(true);
        } else {
            if (
                NEXT_PUBLIC_BYPASS &&
                (NEXT_PUBLIC_BYPASS_LIST.includes(countryCode) ||
                    !NEXT_PUBLIC_BYPASS_LIST.length)
            ) {
                setBypassModalState(true);
            } else {
                setLoading(true);
                updateCartAction([]).then(() => {
                    postCartAction({
                        product_id: prodId,
                        quantity: 1
                    }).then(() => {
                        setLoading(false);
                        router.push('/checkout');
                    });
                });
            }
        }
    };
    const byPassAction = () => {
        // NEXT_PUBLIC_BYPASS_LIST
        processing(true);
        postPurchaseBypass({ publish_id: pubId }).then((res) => {
            addOrderData({ bypass: true });
            router.push('/thanks');
        });
    };
    const addGuidedProdToCart = (prodId, variantId, quantity) => {
        if (!auth.isAuthenticated) {
            setAuthPage('login');
            toggleAuthModal(true);
        } else {
            setLoading(true);
            updateCartAction([]).then((dd) => {
                postCartAction({
                    product_id: prodId,
                    variant_id: variantId,
                    quantity
                }).then(() => {
                    setLoading(false);
                    router.push('/checkout');
                });
            });
        }
    };

    const updateGuidedProdToCart = (cartId, quantity) => {
        setLoading(true);
        updateItemCartAction(cartId, quantity).then(() => {
            setLoading(false);
        });
    };

    const resetCart = () => {
        updateCartAction([]);
        removeVoucherAction();
        // swell.cart.removeCoupon()
    };

    useEffect(() => {
        if (isReady) {
            // resetCart();
            getPrice(type);
        }
    }, []);

    return (
        <div className="">
            {type === 'GUIDED' ? (
                <BuyingCardGuide
                    mobile={mobile}
                    loading={loading}
                    productData={productData}
                    price={productData?.price}
                    addToCart={addGuidedProdToCart}
                    expId={expId}
                    emptyCart={emptyCart}
                    removeFromCart={removeProdFromCart}
                    updateCart={updateGuidedProdToCart}
                    // desc="For a limited time only, you can try our experiences for free!"
                    desc=""
                    handlePanelClick={handlePanelClick}
                />
            ) : (
                <>
                    <BuyingCardDigital
                        mobile={mobile}
                        type={type.toLowerCase()}
                        loading={loading}
                        productData={productData}
                        price={productData?.price}
                        expId={expId}
                        emptyCart={emptyCart}
                        addToCart={addDigitalProdToCart}
                        removeFromCart={removeProdFromCart}
                        // desc="For a limited time only, you can try our experiences for free!"
                        desc=""
                        handlePanelClick={handlePanelClick}
                    />
                </>
            )}
            {bypassModalState && (
                <ModalGenericWithoutAuth
                    close
                    setModalIsOpen={setBypassModalState}>
                    <div className="flex flex-col justify-between-2 min-h-60 h-full md:h-full">
                        <div className="mt-16 md:mt-0 mb-8">
                            For a limited time, we're giving our users free full
                            access to all experiences on our site. Would you
                            like to try this experience?
                        </div>
                        <div className="flex gap-4">
                            {/* <GenericBtn
                                bgColor="bg-green-400 hover:bg-gray-900"
                                className="font-semibold"
                                params={[false]}
                                handleActionBtn={setBypassModalState}>
                                Cancel
                            </GenericBtn> */}
                            {/* <GenericBtn
                                bgColor="bg-green-400 hover:bg-gray-900"
                                className="font-semibold"
                                params={[]}
                                handleActionBtn={byPassAction}>
                                I Want to try this experience
                            </GenericBtn> */}
                            <Button
                                label="Try this experience"
                                as="button"
                                handleClick={byPassAction}
                                width="w-full"
                            />
                        </div>
                    </div>
                </ModalGenericWithoutAuth>
            )}
        </div>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    globalState: state.globalState,
    cart: state.cart,
    session: state.session
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            fetchCartAction,
            postCartAction,
            updateCartAction,
            removeFromCartAction,
            updateItemCartAction,
            removeVoucherAction,
            postPurchaseBypass,
            setAuthPage,
            toggleAuthModal,
            addOrderData
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SectionPricingBooking);
