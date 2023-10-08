import { useState, useEffect } from 'react';
import Router from 'next/router';
import { Slide, Bounce, ToastContainer } from 'react-toastify';
import Script from 'next/script';
import '@/styles/globals.css';
import '@/styles/carouselcards.css';
import '@/styles/gallerySmall.css';
import '@/styles/uploadCare.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-lightbox-pack/dist/index.css';
import Hotjar from '@hotjar/browser';

import { StoreProvider } from 'store-context';


import { connect } from 'react-redux';

import translations from '@/constants/translations';


import { GoogleOAuthProvider } from '@react-oauth/google';


import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import '@/styles/datepicker.custom.css';
import '@/styles/rcSlider.css';
import 'rc-slider/assets/index.css';
import 'react-nice-dates/build/style.css';
import '@/styles/calendar.css';
import '@/styles/editor.css';
import '@/styles/niceDates.css';

import Head from 'next/head';
import SimpleReactLightbox from 'simple-react-lightbox';
import LayoutLoading from '@/components/layouts/LayoutLoading';

import { Provider } from 'react-redux';
import store from '../store';
import { loadUser } from '@/store/actions/auth';
import { fetchStartupData, fetchIpData } from '@/helpers/apiServices/startup';
import TagManager from 'react-gtm-module';
import globalState from '@/store/reducers/globalState';

const contextClass = {
    success: 'bg-green-400 text-green-600',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-600 ',
    warning: 'bg-orange-400',
    default: 'bg-indigo-600',
    dark: 'bg-white-600 text-gray-300'
};

function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);
    const siteId = 3676174;
    const hotjarVersion = 6;
    
    Hotjar.init(siteId, hotjarVersion);
    
    useEffect(() => {
        const start = () => {
            // console.log('start');
            setLoading(true);
        };
        const end = () => {
            // console.log('findished');
            setLoading(false);
        };
        Router.events.on('routeChangeStart', start);
        Router.events.on('routeChangeComplete', end);
        Router.events.on('routeChangeError', end);

        store.dispatch(loadUser());
        store.dispatch(fetchStartupData());
        // store.dispatch(fetchIpData());

        return () => {
            Router.events.off('routeChangeStart', start);
            Router.events.off('routeChangeComplete', end);
            Router.events.off('routeChangeError', end);
        };
    }, []);

    // useEffect(() => {
    //     import('react-facebook-pixel')
    //         .then((x) => x.default)
    //         .then((ReactPixel) => {
    //             ReactPixel.init(
    //                 process.env.NEXT_PUBLIC_META_PIXEL || '387674926449618'
    //             ); // facebookPixelId
    //             ReactPixel.pageView();

    //             Router.events.on('routeChangeComplete', () => {
    //                 ReactPixel.pageView();
    //             });
    //         });
    // }, [Router.events]);

    useEffect(() => {
        TagManager.initialize({
            gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
        });
    }, []);

    return (
        <>
            {loading ? (
                <LayoutLoading />
            ) : (
                <>
                    <Head>
                        <title>Konnect Marketplace</title>
                        <meta
                            name="viewport"
                            content="width=device-width, user-scalable=no, initial-scale=1.0"
                        />

                        <script src="/assets/scripts/log.js"></script>
                    </Head>

                    {/* <script data-consolejs-channel="7c0124fa-ccf6-1d88-6cb0-260834dc58f0" src="https://remotejs.com/agent/agent.js"></script> */}

                    <Script
                        id="hs-script-loader"
                        src="//js-na1.hs-scripts.com/20360780.js"
                        strategy={'afterInteractive'}
                    />

                    <script src="https://accounts.google.com/gsi/client" async defer></script>
                    <script src={process.env.NEXT_PUBLIC_FATOORAH_SESSION_JS}></script>
                    <script src={process.env.NEXT_PUBLIC_FATOORAH_APPLE_PAY_JS}></script>

                    <script src="/assets/scripts/client.js"></script>

                    <Provider store={store}>
                        <GoogleOAuthProvider clientId="923684735717-v5mh2fbatms0qml3mdkv2ph02djvmc8n.apps.googleusercontent.com">
                            <ToastContainer
                                className="mt-36"
                                // toastClassName={({ type }) =>
                                //     contextClass[type || 'default'] +
                                //     'shadow-xl flex relative p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
                                // }
                                // bodyClassName={() =>
                                //     'text-sm text-black text-opacity-80 flex font-medium block p-3'
                                // }
                                position="top-right"
                                hideProgressBar={true}
                                autoClose={1750}
                                transition={Bounce}
                                icon={false}
                                theme="colored"
                            />
                            <SimpleReactLightbox>
                                <StoreProvider>
                                    <Component {...pageProps} />
                                </StoreProvider>
                            </SimpleReactLightbox>
                        </GoogleOAuthProvider>
                    </Provider>

                </>
            )}
        </>
    );
}

export default MyApp;
