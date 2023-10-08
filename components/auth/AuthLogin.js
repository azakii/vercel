import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import AppleLogin from 'react-apple-login'
import * as jose from 'jose'

import { toast } from 'react-toastify';
import ToastMessage from '@/components/blocks/ToastMessage';
import { createDataAdmin, deleteDataAdmin } from '@/helpers/apiServices/user';

import { useRouter } from 'next/router';
import {
    toggleLang,
    toggleNav,
    toggleCart,
    toggleAuthModal,
    setAuthPage
} from '@/store/actions/globalState';
import { login, clearLoginErrors, logout, socialLogin, register } from '@/store/actions/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ButtonLoad from '@/components/blocks/ButtonLoad';

import FormIkInput from '@/components/forms/FormIkInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MadeWithLove from '@/components/blocks/MadeWithLove';
import LayoutLoading from '@/components/layouts/LayoutLoading';

const AuthLogin = ({
    login,
    clearLoginErrors,
    toggleAuthModal,
    socialLogin,
    setAuthPage,
    createDataAdmin,
    deleteDataAdmin,
    register,
    toggleNav,
    auth,
    ...props
}) => {
    const flashingSocial = props.FlashSocial;

    const router = useRouter();
    const handleSubmit = (values, actions) => {
        login({ ...values, identifier: values.identifier.toLowerCase() });
        actions.setSubmitting(false);
    };

    if (auth.isAuthenticated == null) {
        return <LayoutLoading showMessage={false} />;
    }

    return (
        <>
            <div className="">
                <div className="w-full  ml-auto">
                    <div
                        className={`flex flex-col px-8 d-hdpi-2:px-vw-8 pt-8 md:pt-0 `}>
                        <div
                            className={`flex items-center gap-3 flex-row d-hdpi-2:gap-1.5`}>
                            <img
                                src="/assets/media/kn_logoicon.svg"
                                className="h-12 d-hdpi-2:h-vw-12"
                            />

                            <img
                                className="h-6 d-hdpi-2:h-vw-6"
                                src="/assets/media/kn_logotext.svg"
                            />

                            {/* <div className="rounded-full bg-green-400 px-1 text-xxs d-hdpi-2:text-vw-xxs d-hdpi-2:px-vw-1.5 d-hdpi-2:h-vw-4 h-4 flex items-center mt-1.5 d-hdpi-2:mt-vw-1.5">
                                beta
                            </div> */}
                        </div>
                        <div className="flex ">
                            <div className="flex-shrink-0 text-transparent bg-clip-text bg-gradient-to-tl from-gray-900 via-blue-500 to-green-400 text-2xl d-hdpi-2:text-vw-2xl font-bold tracking-tighter mt-10 d-hdpi-2:mt-vw-10 pr-3">
                                Sign in
                            </div>
                        </div>
                        {true && (
                            <div className="">
                                <Formik
                                    initialValues={{
                                        identifier: '',
                                        password: ''
                                    }}
                                    validationSchema={Yup.object({
                                        identifier: Yup.string().required('*'),

                                        password: Yup.string().required('*')
                                    })}
                                    onSubmit={handleSubmit}>
                                    {(props) => (
                                        <Form id="loginForm">
                                            <div className="flex flex-col mt-6 gap-12 lg:gap-0 d-hdpi-2:mt-vw-6 ">
                                                <div className="w-full flex-1 flex flex-col">
                                                    <FormIkInput
                                                        name="identifier"
                                                        type="text"
                                                        placeholder={
                                                            'E-mail or username'
                                                        }
                                                        autoComplete="off"
                                                        className="mb-4 d-hdpi-2:mb-vw-4"
                                                    />

                                                    <FormIkInput
                                                        name="password"
                                                        type="password"
                                                        placeholder={'Password'}
                                                        autoComplete="off"
                                                    />

                                                    <div className="flex justify-center mt-6 d-hdpi-2:mt-vw-6">
                                                        <Link href="#" onClick={() => setAuthPage('reset')} className="text-base text-green-400 font-medium d-hdpi-2:text-vw-base">
                                                            Forgot
                                                            Password?</Link>
                                                    </div>
                                                    <ButtonLoad
                                                        isLoading={auth.loading}
                                                        label="Sign in"
                                                        width="w-full"
                                                        form="loginForm"
                                                        type="submit"
                                                    />
                                                    <div class={flashingSocial ? 'blink' : ''} style={{ marginTop: '20px' }}>
                                                        <div style={{
                                                            marginTop: '0px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>

                                                            <AppleLogin clientId="com.viakonnect.auth.prod"
                                                                render={(renderProps) => {
                                                                    return (<img src='data:image/png;base64,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' style={{ cursor: 'pointer', height: '30px', marginBottom: '10px' }} onClick={renderProps.onClick} />)
                                                                }}
                                                                usePopup={true} scope="name email" redirectURI={process.env.NEXT_PUBLIC_OAUTH_APPLE_REDIRECT_URI} callback={resp => {
                                                                    //Nothing
                                                                    console.log(resp);
                                                                    if (resp.error) {
                                                                        toast.success(
                                                                            <ToastMessage
                                                                                icon="!"
                                                                                msg="Apple sign-in couldn't complete."
                                                                                alignTop={false}
                                                                            />,
                                                                            {
                                                                                hideProgressBar: true,
                                                                                autoClose: 2500
                                                                            }
                                                                        );
                                                                        return;
                                                                    }

                                                                    const JWKS = jose.createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

                                                                    jose.jwtVerify(resp.authorization.id_token, JWKS, {
                                                                        issuer: 'https://appleid.apple.com',
                                                                        audience: 'com.viakonnect.auth.prod',
                                                                    }).then(({ payload }) => {
                                                                        console.log(payload);
                                                                        let profile = payload;

                                                                        let name = resp.user?.name.firstName || "Konnect Member";
                                                                        let email = String(profile.email).toLowerCase();
                                                                        let verified = profile.email_verified;
                                                                        let picture = null; //profile.picture;
                                                                        let id = profile.sub;
                                                                        let provider = 'apple';
                                                                        let first = resp.user?.name.firstName || "Konnect";
                                                                        let last = resp.user?.name.lastName || "Member";
                                                                        socialLogin({ id, email, name, first, last, picture, provider, register, createDataAdmin, deleteDataAdmin, setAuthPage, toggleAuthModal, router, toggleNav, toggleAuthModal });

                                                                    });
                                                                }} />
                                                        </div>

                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>

                                                            <GoogleLogin

                                                                onSuccess={credentialResponse => {
                                                                    console.log(credentialResponse);

                                                                    const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

                                                                    jose.jwtVerify(credentialResponse.credential, JWKS, {
                                                                        issuer: 'https://accounts.google.com',
                                                                        audience: '923684735717-v5mh2fbatms0qml3mdkv2ph02djvmc8n.apps.googleusercontent.com',
                                                                    }).then(({ payload }) => {
                                                                        console.log(payload);
                                                                        let profile = payload;

                                                                        let name = profile.name;
                                                                        let email = profile.email;
                                                                        let verified = profile.email_verified;
                                                                        let picture = profile.picture;
                                                                        let id = profile.sub;
                                                                        let provider = 'google';
                                                                        let first = profile.given_name;
                                                                        let last = profile.family_name;
                                                                        socialLogin({ id, email, name, first, last, picture, provider, register, createDataAdmin, deleteDataAdmin, setAuthPage, toggleAuthModal, router, toggleNav, toggleAuthModal });

                                                                    })


                                                                }}
                                                                onError={() => {
                                                                    console.log('Login Failed');
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="flex-1 flex flex-col -mt-12 lg:mt-0">
                                                    <div className="flex items-center justify-items py-10 d-hdpi-2:py-vw-10">
                                                        <span className="flex-1 border-b border-gray-300 mr-3 d-hdpi-2:mr-vw-3" />
                                                        <span className="flex-shrink-0 text-gray-400 text-sm d-hdpi-2:text-vw-sm">
                                                            or
                                                        </span>
                                                        <span className="flex-1 border-b border-gray-300 ml-3 d-hdpi-2:ml-vw-3" />
                                                    </div>
                                                    <div className="flex justify-center items-center text-sm gap-2 d-hdpi-2:text-vw-sm d-hdpi-2:gap-1">
                                                        <span>
                                                            Don't have an
                                                            account?
                                                        </span>
                                                        <button
                                                            className="text-base text-green-400 font-medium d-hdpi-2:text-vw-base"
                                                            onClick={() =>
                                                                setAuthPage(
                                                                    'register'
                                                                )
                                                            }>
                                                            Sign up
                                                        </button>
                                                    </div>

                                                    <MadeWithLove />
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        )}
                    </div>
                </div>
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
            toggleAuthModal,
            setAuthPage,
            login,
            socialLogin,
            register,
            toggleAuthModal,
            setAuthPage,
            createDataAdmin,
            deleteDataAdmin,
            clearLoginErrors,
            toggleNav
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLogin);
