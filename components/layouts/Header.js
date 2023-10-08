import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';



import { createDataAdmin, deleteDataAdmin } from '@/helpers/apiServices/user';

//import { fetchCartAction } from '@/store/actions/swell/cart';
import Link from 'next/link';
import {
    toggleLang,
    toggleNav,
    toggleCart,
    toggleAuthModal,
    setAuthPage
} from '@/store/actions/globalState';
import { logout, socialLogin, register } from '@/store/actions/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from '@/components/blocks/Search/Search';
import LangList from '@/blocks/LangList';
import Avatar from '@/specialty/Avatar';
import NavbarSidebar from '@/layouts/NavbarSidebar';
import NavbarSidebarCart from '@/layouts/NavbarSidebarCart';
import IconsLucide from '@/blocks/Icon/IconsLucide';
import NavbarItem from '@/blocks/NavbarItem';

import { handleRowReverse } from '@/helpers/FEutils';
import translations from '@/constants/translations';

// import { NEXT_URL } from '@/config/index';

import debounce from '@/helpers/debounce';
import ModalAuth from '../blocks/Modal/ModalAuth';
import classNames from 'classnames';
import NavLink from '../blocks/NavLink';
import MenuLink from '../blocks/MenuLink';
import { kreatorPath } from '@/constants/globalConsts';

const Header = ({
    //  fetchCartAction,
    toggleLang,
    toggleNav,
    toggleCart,
    toggleAuthModal,
    setAuthPage,
    socialLogin,
    register,
    createDataAdmin,
    deleteDataAdmin,
    logout,
    globalState: {
        rtl,
        lang,
        navIsOpen,
        cartIsOpen,
        authModalIsOpen,
        authComponent
    },
    auth,
    auth: { user, isAuthenticated, isProfile, loading },

    isLogo = true,
    isSearch = false,
    isAvatar = true,
    isLang = true,
    isMenu = true,
    isCustom = null,

    children
}) => {
    const [scrollPos, setScrollPos] = useState(0);
    const [showHeader, setShowHeader] = useState(true);

    const router = useRouter();
    const handleClick = (e) => {
        e.preventDefault();
        router.push('/');
    };

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 100);

        window.addEventListener('scroll', debouncedHandleScroll);

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
        };
    }, [scrollPos]);

    const handleScroll = () => {
        if (typeof window !== 'undefined') {
            const currentScrollPos = window.scrollY;
            // console.log('direction: ', currentScrollPos - scrollPos);

            setShowHeader(currentScrollPos - scrollPos < 0 || scrollPos < 400);
            setScrollPos(currentScrollPos);
        }
    };

    const handleSignin = () => {
        toggleNav(false);
        setAuthPage('login');
        toggleAuthModal(true);
    };

    const handleSignup = () => {
        toggleNav(false);
        setAuthPage('register');
        toggleAuthModal(true);
    };

    const handleLogout = () => {
        toggleNav(false);
        toggleAuthModal(false);
        logout();
    };

    useEffect(() => {
        if (isAuthenticated && !isProfile && !loading) {
            setAuthPage('profile');
        }
    }, [auth]);

    useEffect(() => {
        // console.log(lang);
        let dir = lang == "ar" ? "rtl" : "ltr";
        // let lang = locale == "ar" ? "ar" : "en";
        document.querySelector("html").setAttribute("dir", dir);

        // document.querySelector("html").setAttribute("lang", lang);
    }, [lang]);


    return (
        <>
            <header
                style={{ zIndex: 300 }}
                className={`${handleRowReverse(rtl).rtl
                    } fixed top-0 w-full inset-x-0 h-16 md:h-20 d-hdpi-2:h-vw-20 bg-white2 d-hdpi-2:text-vw-base bg-green-400 shadow-cards flex items-center transform-gpu duration-300 ${showHeader
                        ? 'translate-y-0'
                        : '-translate-y-24 d-hdpi-2:-translate-y-vw-24'
                    }`}>
                <div className="flex flex-1 flex-row justify-between items-center h-full ">
                    <div className="flex lg:w-1/3 items-center gap-2">
                        <div className="flex flex-shrink-0 ">
                            <div
                                onClick={handleClick}
                                className={`flex items-center cursor-pointer ${rtl
                                    ? 'mr-6 md:mr-8 lg:mr-10 xl:mr-32 2xl:mr-44 d-hdpi-2:mr-vw-44'
                                    : 'ml-6 md:ml-8 lg:ml-10 xl:ml-32 2xl:ml-44 d-hdpi-2:ml-vw-44'
                                    } gap-3 d-hdpi-2:gap-2 ${handleRowReverse(rtl).flex
                                    }`}>
                                {/* <img src="/assets/media/kn_logoicon.svg" /> */}
                                <img
                                    src="/assets/media/kn_logoicon_black.svg"
                                    className="d-hdpi-2:h-vw-12 mix-blend-multiplya opacity-90a"
                                />

                                <img
                                    className="d-hdpi-2:h-vw-6 mix-blend-multiply opacity-80a"
                                    src="/assets/media/kn_logotext.svg"
                                />
                            </div>
                        </div>
                        {/* <div className="rounded-full bg-white px-1 text-xxs d-hdpi-2:text-vw-xxs d-hdpi-2:px-vw-1 d-hdpi-2:h-vw-4 h-4 flex items-center mt-1.5 d-hdpi-2:mt-vw-1.5">
                            beta
                        </div> */}
                    </div>
                    <div className="flex lg:w-1/3 items-center justify-center">
                        
                            <form className="w-full pr-10">   
                                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm border-0 text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none rounded-full" placeholder="Search by Destination, Kreator...." required />
                                    <button type="submit" className="text-white absolute hidden right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>

                    </div>
                    <div className="flex justify-end items-center h-full  lg:w-2/3">
                        <div className="hidden md:flex text-sma items-center gap-4 lg:gap-8 mr-6 d-hdpi-2:mr-vw-6">
                            <MenuLink label={translations[lang].home} href="/" />
                            {/* <MenuLink
                                label={'About us'}
                                href="/help/article/1001"
                            /> */}
                            <MenuLink
                                label={translations[lang].howItWorks}
                                href="/about/marketplace"
                            />
                            <MenuLink
                                label={translations[lang].kreatorPortal}
                                href={`${kreatorPath}/c`}
                                type="url"
                                sameWindow
                            />
                        </div>
                        {isAvatar ? (
                            <div
                                className={`hidden lg:flex items-center ${isLang ? '' : 'mr-10 d-hdpi-2:mr-vw-10'
                                    }`}>
                                <div className="hidden xl:block mx-4 text-sm d-hdpi-2:text-vw-sm d-hdpi-2:mx-vw-4 d-hdpi-2:block">
                                    {user
                                        ? `${translations[lang].messages.hello
                                        } ${user?.profile?.first ||
                                        user?.email ||
                                        ''
                                        }`
                                        : translations[lang].guest}
                                </div>
                                {user?.profile?.avatar ? (
                                    <Avatar
                                        profile={user?.profile}
                                        username={user.username}
                                    />
                                ) : (
                                    <i className="ri-user-3-line text-2xl d-hdpi-2:text-vw-2xl"></i>
                                    // <IconsLucide icon="User" />
                                )}
                            </div>
                        ) : null}
                        {false && isLang && <LangList />}

                        {isMenu && (
                            <>
                                {/* <button
                                onClick={() => toggleCart(!cartIsOpen)}
                                className={`focus:outline-none w-20 
                                flex flex-shrink-0 h-12 items-center justify-center text-2xl bg-green-400 transition-all duration-200 hover:bg-gray-900 hover:text-white ${
                                    rtl ? 'rounded-r-lg' : 'rounded-l-lg'
                                }`}>
                                <i
                                    className={`${
                                        rtl
                                            ? 'ri-menu-2-line'
                                            : 'ri-menu-3-line'
                                    }`}></i>
                            </button> */}
                                <button
                                    onClick={() => toggleNav(!navIsOpen)}
                                    className={`focus:outline-none w-20 d-hdpi-2:w-vw-20
                               flex flex-shrink-0 h-12 d-hdpi-2:h-vw-12 items-center justify-center text-2xl d-hdpi-2:text-vw-2xl bg-gray-800 transition-all duration-200 hover:bg-white text-white hover:text-gray-900 ${rtl
                                            ? 'rounded-r-lg d-hdpi-2:rounded-r-vw-lg'
                                            : 'rounded-l-lg d-hdpi-2:rounded-l-vw-lg'
                                        }`}>
                                    <i
                                        className={`${rtl
                                            ? 'ri-arrow-left-line'
                                            : 'ri-arrow-right-line'
                                            }`}></i>
                                </button>
                            </>
                        )}
                        {isCustom}
                    </div>
                </div>
            </header>
            {/* <NavbarSidebarCart>kjh</NavbarSidebarCart> */}
            {isMenu && (
                <NavbarSidebar>
                    <div className="md:hidden">
                        <NavbarItem
                            // justify="justify-center"
                            label={'Home'}
                            icon="ri-store-line"
                            link={'/'}
                            // handleClick={() => console.log('hello')}
                            handleClick={() => toggleNav(false)}
                            rtl={rtl}
                        />

                        <NavbarItem
                            label={'How it works'}
                            icon="ri-book-read-line"
                            link={`/about/marketplace`}
                            // handleClick={() => console.log('hello')}
                            handleClick={() => toggleNav(false)}
                            rtl={rtl}
                        />
                        <NavbarItem
                            label={'Kreator Platform'}
                            link={`${kreatorPath}/c`}
                            icon="ri-layout-masonry-line"
                            // handleClick={() => console.log('hello')}
                            handleClick={() => toggleNav(false)}
                            rtl={rtl}
                        />

                        <div className="border-b border-gray-200 my-4 d-hdpi-2:my-vw-4"></div>
                    </div>

                    {isAuthenticated ? (
                        <>
                            {/* <NavbarItem
                                label={translations[lang].menu.messages.title}
                                icon="Inbox"
                                link={`${NEXT_URL}/c/messages`}
                                handleClick={()=>toggleNav(false)}
                                rtl={rtl}
                            /> */}
                            <NavbarItem
                                label={
                                    translations[lang].menu.myPurchases.title
                                }
                                icon="ri-wallet-line"
                                link={`/experiences/purchased`}
                                handleClick={() => toggleNav(false)}
                                rtl={rtl}
                            />
                            {/* <NavbarItem
                                label={
                                    translations[lang].menu.myFavourites.title
                                }
                                icon="Heart"
                                link={`${NEXT_URL}/favourites`}
                                handleClick={()=>toggleNav(false)}
                                rtl={rtl}
                            /> */}
                            <NavbarItem
                                label={translations[lang].menu.profile.title}
                                icon="ri-user-3-line"
                                link={`/profile`}
                                handleClick={() => toggleNav(false)}
                                rtl={rtl}
                            />
                            {/* <NavbarItem
                                label={translations[lang].menu.helpCenter.title}
                                icon="ri-question-line"
                                link={`http://academy.viakonnect.com`}
                                // handleClick={() => console.log('hello')}
                                handleClick={()=>toggleNav(false)}
                                rtl={rtl}
                            /> */}
                            <NavbarItem
                                label={translations[lang].menu.signout.title}
                                icon="ri-logout-box-r-line"
                                handleClick={handleLogout}
                                rtl={rtl}
                            />
                        </>
                    ) : (
                        <>

                            <NavbarItem
                                label={translations[lang].menu.signin.title}
                                icon="ri-login-box-line"
                                handleClick={handleSignin}
                                rtl={rtl}
                            />
                            <NavbarItem
                                label={translations[lang].menu.signup.title}
                                icon="ri-user-add-line"
                                handleClick={handleSignup}
                                rtl={rtl}
                            />
                            {/* <NavbarItem
                                label={translations[lang].menu.helpCenter.title}
                                icon="ri-book-open-line"
                                link={`http://academy.viakonnect.com`}
                                handleClick={() => toggleNav(false)}
                                rtl={rtl}
                            /> */}
                        </>
                    )}
                </NavbarSidebar>
            )}
            <ModalAuth />
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
            toggleNav,
            toggleCart,
            logout,
            socialLogin,
            register,
            toggleAuthModal,
            setAuthPage,
            createDataAdmin,
            deleteDataAdmin,
            // fetchCartAction
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
