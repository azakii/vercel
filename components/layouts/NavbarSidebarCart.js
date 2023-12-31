import React from 'react';

import { handleRowReverse } from 'helpers/FEutils';
import { toggleLang, toggleCart } from '@/store/actions/globalState';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Avatar from '@/specialty/Avatar';
import IconsLucide from '@/blocks/Icon/IconsLucide';

const NavbarSidebarCart = ({
    children,
    toggleCart,
    globalState: { rtl, lang, cartIsOpen },
    auth
}) => {
    const getName = () => {
        const showName =
            auth?.user?.profile?.displayname || auth?.user?.profile?.first;
        const theClass = showName.length > 20 ? 'text-sm' : '';
        return {
            string: showName,
            strClass: theClass
        };
    };

    return (
        <>
            <div
                style={{ zIndex: 302 }}
                className={`fixed inset-0  ${
                    cartIsOpen ? '' : 'pointer-events-none'
                }`}
                onClick={() => toggleCart(!cartIsOpen)}></div>
            <div
                style={{ zIndex: 303 }}
                className={`fixed inset-y-0 ${
                    handleRowReverse(rtl).right
                }-0 w-full md:w-96 bg-white  shadow-images transition duration-300 ease-in-out transform-gpu ${
                    cartIsOpen
                        ? 'translate-x-0'
                        : handleRowReverse(rtl).menuTranslateReverse +
                          ' pointer-events-none'
                }`}>
                <nav className=" flex flex-col relative flex-1 pt-40 md:pt-28">
                    <div className="md:hidden fixed inset-x-0 top-6">
                        <div
                            className={`flex  items-center ml-8 gap-3 ${
                                handleRowReverse(rtl).flex
                            }`}>
                            <img src="/assets/media/kn_logoicon.svg" />
                            <img
                                className=""
                                src="/assets/media/kn_logotext.svg"
                            />
                        </div>
                    </div>

                    <div className="fixed inset-x-0 bottom-full top-6">
                        <div
                            className={`flex gap-4 md:gap-0 flex-col-reverse md:flex-row  md:justify-between md:items-center `}>
                            <div
                                className={`${
                                    auth?.user ? 'ml-8' : 'ml-12'
                                } flex items-center`}>
                                {auth?.user?.profile ? (
                                    <Avatar
                                        profile={auth?.user?.profile}
                                        username={auth?.user?.username}
                                        size="w-12 h-12"
                                    />
                                ) : (
                                    <IconsLucide icon="User" />
                                )}

                                <div className="px-2">
                                    {auth?.user?.profile ? (
                                        <>
                                            <div
                                                className={`${
                                                    getName().strClass
                                                }`}>
                                                {getName().string}
                                            </div>
                                            <div className="text-xs font-semibold">
                                                @{auth?.user?.username}
                                            </div>
                                        </>
                                    ) : (
                                        <div>Guest</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end md:justify-start ">
                                <button
                                    onClick={() => toggleCart(!cartIsOpen)}
                                    className={`focus:outline-none w-20 h-12
                                       flex  items-center justify-center text-2xl bg-green-400 hover:bg-gray-900 hover:text-white ${
                                           rtl ? 'rounded-r-lg' : 'rounded-l-lg'
                                       }`}>
                                    <i
                                        className={`${
                                            rtl
                                                ? 'las la-arrow-left'
                                                : 'las la-arrow-right'
                                        }`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`border-t border-b border-gray-200 pt-8 pb-8 ${
                            handleRowReverse(rtl).rtl
                        }`}>
                        {/* {children} */}
                        CART
                    </div>
                    <div className="px-12 flex items-center mt-8">
                        <a
                            target="_blank"
                            href="https://kreator.viakonnect.com/c"
                            className="flex-1 py-3 px-4 rounded-full flex items-center justify-center border-2 border-green-400  hover:border-green-400 ring-4 ring-transparent hover:ring-green-200   hover:bg-green-50 transition-all duration-200 ease-in-out shadow-2xl-green-400">
                            Become a kreator
                        </a>
                    </div>
                </nav>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            toggleLang,
            toggleCart
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarSidebarCart);
