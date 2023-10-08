import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toggleAuthModal, setAuthPage } from '@/store/actions/globalState';
import { sendReset, clearLoginErrors } from '@/store/actions/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ButtonLoad from '@/components/blocks/ButtonLoad';

import FormIkInput from '@/components/forms/FormIkInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import MadeWithLove from '@/components/blocks/MadeWithLove';
import LayoutLoading from '@/components/layouts/LayoutLoading';

const AuthAccountReset = ({
    sendReset,
    clearLoginErrors,
    toggleAuthModal,
    setAuthPage,
    clearAllBodyScrollLocks,
    auth,
    ...props
}) => {
    const router = useRouter();
    const handleSubmit = (values, actions) => {
        sendReset({ ...values, email: values.identifier.toLowerCase() });
        actions.setSubmitting(false);
        setTimeout(() => {
            toggleAuthModal(false);
        }, 1000);
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
                                Reset Password
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

                                        // password: Yup.string().required('*')
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
                                                            'E-mail'
                                                        }
                                                        autoComplete="off"
                                                        className="mb-4 d-hdpi-2:mb-vw-4"
                                                    />

                                                </div>
                                                <ButtonLoad
                                                    isLoading={auth.loading}
                                                    label="Send Reset Email"
                                                    width="w-full"
                                                    form="loginForm"
                                                    type="submit"
                                                />
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
            sendReset,
            clearLoginErrors
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthAccountReset);
