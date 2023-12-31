import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'components/blocks/Button/Button';
import Spinner from '@/components/blocks/Spinner';
import useXchangeRate from 'helpers/useXchangeRate2';
import { formatPrice } from 'helpers/LocaleHelper';
import { currenciesObject } from 'constants/currenciesObject';
import SkeletonText from '../blocks/Card/SkeletonText';
import SkeletonButton from '../blocks/Card/SkeletonButton';
import classNames from 'classnames';
import PillType from '../blocks/Card/PillType';
import { NEXT_PUBLIC_BYPASS } from '@/constants/public';
import { emptyCart } from '@/swell/api/cart';

const currencyOptions = {
    rounding: 0.001
};

const BuyingCardDigital = ({
    mobile,
    auth,
    productData,
    loading = true,
    // preferredCurrency = 'USD',
    classes,
    price = 50,
    desc = '',
    children,
    cart,
    expId,
    addToCart,
    removeFromCart,
    purchasedData: { loadingIds, purchasedIds },
    handlePanelClick
}) => {
    const preferredCurrency = 'SAR'; //auth?.user?.profile?.currency ?? 'USD';

    const { values, currency, rate } = useXchangeRate(
        [price],
        'USD',
        preferredCurrency
    );
    const [digitalBtnInfo, setdigitalBtnInfo] = useState({
        showBuyBtn: true,
        showRmCartBtn: false
    });
    const productCartId = useRef(null);
    const productId = useRef(null);
    const { showBuyBtn, showRmCartBtn } = digitalBtnInfo;
    const removeExpFromCart = () => {
        removeFromCart(productCartId.current);
    };
    const addExpToCart = () => {
        try {
            emptyCart();
        } catch (e) {
            console.log(e);
        }
        setTimeout(() => {
            addToCart(productId.current);

        }, 1000);
    };

    useEffect(() => {
        if (!loading) {
            const {
                id,
                content: { experience_id }
            } = productData;

            productId.current = id;

            // this will check if in cart but if already bought
            // do that check first

            if (cart !== null) {
                const { digital } = cart;
                productCartId.current = digital[expId]
                    ? digital[expId].id
                    : null;
                if (productCartId.current) {
                    setdigitalBtnInfo({
                        showBuyBtn: false,
                        showRmCartBtn: true
                    });
                } else {
                    setdigitalBtnInfo({
                        showBuyBtn: true,
                        showRmCartBtn: false
                    });
                }
            }
        }
    }, [productData, cart, loading]);

    return (
        <div
            className={classNames(
                'relative flex flex-col px-4 xl:px-8 pt-8 pb-4  xl:pb-8 bg-kn-white d-hdpi-2:px-vw-8 d-hdpi-2:pb-vw-8 d-hdpi-2:pt-vw-8 d-hdpi-2:text-vw-base',
                mobile
                    ? 'rounded-t-2xl shadow-cards-top d-hdpi-2:rounded-t-vw-2xl md:rounded-2xl md:shadow-cards'
                    : 'rounded-2xl shadow-cards d-hdpi-2:rounded-vw-2xl',
                classes
            )}>
            {!loading && !loadingIds ? (
                <>
                    <div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                        onClick={handlePanelClick}>
                        <PillType type="digital" label="Buying Options" />
                    </div>
                    <div className="flex flex-col md:flex-row lg:flex-col">
                        <div className="flex justify-center gap-4 md:gap-0 md:flex-col pb-2  rounded-xl bg-kn-gray-100 px-4 lg:px-8 py-4 d-hdpi-2:px-vw-8 d-hdpi-2:py-vw-4">
                            <div className="flex items-center gap-2 justify-center">
                                <i className="ri-download-cloud-2-line text-xl text-green-500 d-hdpi-2:text-vw-2xl"></i>
                                <div className="text-xs uppercase d-hdpi-2:text-vw-xs">
                                    Digital Access Price
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-2xl font-semibold uppercase justify-center d-hdpi-2:gap-vw-1 d-hdpi-2:text-vw-2xl">
                                <div
                                    className={classNames('flex items-center')}>
                                    <span
                                        className={classNames(
                                            NEXT_PUBLIC_BYPASS &&
                                            'line-through text-red-600',
                                            'text-base d-hdpi-2:text-vw-base'
                                        )}>
                                        $
                                    </span>
                                    <span
                                        className={classNames(
                                            NEXT_PUBLIC_BYPASS &&
                                            'line-through text-red-600'
                                        )}>
                                        {formatPrice(
                                            price,
                                            'USD',
                                            window.navigator.language,
                                            currencyOptions
                                        )}
                                        {/* <span className="absolute top-1/2 transform -translate-y-1/2 inset-x-0 h-1 bg-red-500"></span> */}
                                    </span>
                                    {NEXT_PUBLIC_BYPASS && (
                                        <span className="ml-2 text-xl d-hdpi-2:text-vw-xl">
                                            Free trial
                                        </span>
                                    )}
                                </div>

                                {preferredCurrency !== 'USD' &&
                                    !NEXT_PUBLIC_BYPASS && (
                                        <>
                                            <i className="las la-equals text-green-500 d-hdpi-2:text-vw-2xl"></i>
                                            <span className="relative">
                                                {`~${formatPrice(
                                                    values[0],
                                                    preferredCurrency,
                                                    window.navigator.language,
                                                    currencyOptions
                                                )}`}
                                                {/* <span className="absolute top-1/2 transform -translate-y-1/2 inset-x-0 h-1 bg-red-500"></span> */}
                                            </span>
                                            <div className="text-sm d-hdpi-2:text-vw-sm">
                                                {currency.symbol}*
                                            </div>
                                        </>
                                    )}
                            </div>
                        </div>
                        {true && (
                            <div className="hidden md:block border-b border-green-600 border-opacity-20 pb-4 mt-4 px-2 d-hdpi-2:pb-vw-4 d-hdpi-2:mt-vw-4 d-hdpi-2:px-vw-2">
                                <p className="">{desc}</p>
                            </div>
                        )}

                        <div className="flex-grow">
                            <div className="hidden md:block mt-4 pb-4 px-2 d-hdpi-2:mt-vw-4 d-hdpi-2:pb-vw-4 d-hdpi-2:px-vw-2">
                                <div className="flex items-center gap-1 text-xs d-hdpi-2:gap-0.5 d-hdpi-2:text-vw-xs">
                                    <div
                                        className={classNames(
                                            NEXT_PUBLIC_BYPASS &&
                                            'line-through '
                                        )}>
                                        * Charged as
                                    </div>
                                    <div
                                        className={classNames(
                                            NEXT_PUBLIC_BYPASS &&
                                            'line-through '
                                        )}>
                                        $US
                                    </div>
                                    <span
                                        className={classNames(
                                            NEXT_PUBLIC_BYPASS &&
                                            'line-through '
                                        )}>
                                        {formatPrice(
                                            price,
                                            'USD',
                                            window.navigator.language,
                                            currencyOptions
                                        )}
                                    </span>
                                </div>
                                {preferredCurrency !== 'USD' &&
                                    !NEXT_PUBLIC_BYPASS && (
                                        <div className="flex items-center gap-1 text-xs d-hdpi-2:gap-0.5 d-hdpi-2:text-vw-xs">
                                            <div className="">** 1 $US ~ </div>

                                            <span>
                                                {formatPrice(
                                                    rate,
                                                    'USD',
                                                    window.navigator.language,
                                                    currencyOptions
                                                )}
                                            </span>
                                            <div className="">
                                                {
                                                    currenciesObject[
                                                        preferredCurrency
                                                    ].symbol
                                                }
                                            </div>
                                        </div>
                                    )}
                            </div>

                            <div
                                className={classNames(
                                    'h-full flex items-center flex-col justify-between',
                                    mobile && 'mt-4 d-hdpi-2:mt-vw-4'
                                )}>
                                {(showBuyBtn || showRmCartBtn) &&
                                    !purchasedIds.includes(expId) && (
                                        <Button
                                            label={
                                                NEXT_PUBLIC_BYPASS
                                                    ? auth.isAuthenticated
                                                        ? 'Try Now'
                                                        : 'Sign in to try'
                                                    : auth.isAuthenticated
                                                        ? 'Buy Now'
                                                        : 'Sign in to buy'
                                            }
                                            as="button"
                                            handleClick={addExpToCart}
                                            width="w-full"
                                        />
                                    )}
                                {purchasedIds.includes(expId) && (
                                    <>
                                        <div
                                            className={classNames(
                                                'w-full rounded-lg d-hdpi-2:rounded-vw-lg bg-gray-50 flex items-center justify-center py-4 d-hdpi-2:py-vw-4'
                                            )}>
                                            Already purchased
                                        </div>
                                        <Button
                                            label="View My Purchases"
                                            as="link"
                                            link="/experiences/purchased"
                                            // handleClick={addExpToCart}
                                            width="w-full"
                                        />
                                    </>
                                )}
                                {/* {showRmCartBtn && (
                                    <Button
                                        label="remove from basket"
                                        as="button"
                                        handleClick={removeExpFromCart}
                                        width="w-full"
                                    />
                                )} */}
                                {!showBuyBtn && !showRmCartBtn && (
                                    <div>Already purchased</div>
                                )}

                                {children}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                        <PillType type="digital" label="Buying Options" />
                    </div>
                    <div className="flex flex-col pb-2 d-hdpi-2:pb-vw-2 rounded-xl d-hdpi-2:rounded-vw-xl bg-kn-gray-100 px-4 lg:px-8 py-4 d-hdpi-2:px-vw-8 d-hdpi-2:py-vw-4">
                        <div className="flex items-center gap-2 d-hdpi-2:gap-1 justify-center">
                            {/* <i className="ri-download-cloud-2-line text-xl text-green-500"></i> */}
                            <SkeletonText
                                width="w-6 d-hdpi-2:w-vw-6"
                                height="h-6 d-hdpi-2:h-vw-6"
                            />
                            <SkeletonText width="w-28 d-hdpi-2:w-vw-28" />
                            {/* <div className="text-xs uppercase">
                                Digital Access Price
                            </div> */}
                        </div>
                        <div className="justify-center flex items-center gap-2 d-hdpi-2:gap-1 text-2xl d-hdpi-2:text-vw-2xl font-semibold uppercase animate-pulse my-4 d-hdpi-2:my-vw-4">
                            <SkeletonText width="w-28 d-hdpi-2:w-vw-28" />
                            <SkeletonText width="w-16 d-hdpi-2:w-vw-16" />
                        </div>
                    </div>
                    {!mobile && (
                        <>
                            <div className="border-b border-green-600 border-opacity-20 pb-4 mt-4 px-2 d-hdpi-2:pb-vw-4 d-hdpi-2:mt-vw-4 d-hdpi-2:px-vw-2">
                                <p className="">{desc}</p>
                            </div>
                            <div className="py-6 px-2 d-hdpi-2:py-vw-6 d-hdpi-2:px-vw-2">
                                <div className="flex flex-col gap-3 text-xs d-hdpi-2:gap-1.5 d-hdpi-2:text-vw-xs">
                                    <SkeletonText width="w-28 d-hdpi-2:w-vw-28" />
                                    <SkeletonText width="w-20 d-hdpi-2:w-vw-20" />
                                </div>
                            </div>
                        </>
                    )}

                    <div
                        className={classNames(
                            'h-full flex items-center flex-col justify-between',
                            mobile && 'mt-4 d-hdpi-2:mt-vw-4'
                        )}>
                        <SkeletonButton width="w-full" />

                        {children}
                    </div>
                </>
            )}
        </div>
    );
};
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            //fetchPurchasedIds
        },
        dispatch
    );
}
const mapStateToProps = (state) => ({
    purchasedData: state.purchased,
    globalState: state.globalState,
    auth: state.auth,
    cart: state.cart // check what already in yhe cart

    // also once logged in check if they already booked this product
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyingCardDigital);
