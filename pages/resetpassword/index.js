import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { updateUsernameAdmin } from '@/helpers/apiServices/user';
import uiStruct from 'constants/uiStruct';
import translations from 'constants/translations';
import Editor from 'components/blocks/Editor';

import { toast } from 'react-toastify';
import ToastMessage from '@/components/blocks/ToastMessage';

import UploadGalleryImages from 'components/specialty/UploadGalleryImages';
import { Block__InputSingle } from 'components/blocks/Blocks';
import { testValidUrl, validateEmail } from 'helpers/FEutils';
import { regexPassword, regexUsername } from 'components/utility/regexPatterns';
import Image from 'components/blocks/Image';
import { ButtonsClose } from 'components/blocks/Buttons';
import { ModalButton } from 'components/blocks/ModalTre';
import LayoutLoading from 'components/layouts/LayoutLoading';
//import InfoModal from 'components/modals/InfoModal';
import GenericCheckBox from 'components/blocks/GenericCheckBox';
import CurrencyList from 'components/blocks/CurrencyList';
import CountryList from 'components/blocks/CountryList';
import Script from 'next/script';
import Layout from '@/layouts/Layout';
import Row from '@/components/sections/Row';
import SectionTitle from '@/components/blocks/Title/SectionTitle';
// import ButtonLoad from '@/components/blocks/ButtonLoad';
import ButtonLoad from '@/blocks/Button/ButtonLoad';

function ResetPassword(props) {
    const [busyCreating, setBusyCreating] = useState(false);
    const router = useRouter()

    const initialValues = {
        password: "",
        passwordConfirmation: "",
    }


    const sendPasswordReq = () => {
        (async () => {
            var password = document.getElementById('password').value;
            var passwordConfirmation = document.getElementById('passwordConfirmation').value;

            const data = new URLSearchParams();
            data.append("code", router.query.code);
            data.append("password", password);
            data.append("passwordConfirmation", passwordConfirmation);


            const _resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: "POST",
                body: data,
            });

            const resp = await _resp.json();
            if (typeof resp.jwt != 'undefined') {
                toast.success(
                    <ToastMessage
                        icon="😊"
                        msg="Password changed, you can now login !"
                        alignTop={false}
                    />,
                    {
                        hideProgressBar: true,
                        autoClose: 2500
                    }
                );

                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }
            else {
                toast.success(
                    <ToastMessage
                        icon="⚠️"
                        msg={resp.message[0].messages[0].message}
                        alignTop={false}
                    />,
                    {
                        hideProgressBar: true,
                        autoClose: 2500
                    }
                );
            }
        })();

    }

    return (
        <Layout>
            <Script>UPLOADCARE_PUBLIC_KEY = '8655037f335d8f4f0419';</Script>

            <div className="w-full mt-16 d-hdpi-2:mt-vw-16 d-hdpi-2:text-vw-base mb-16 d-hdpi-2:mb-vw-16">
                <div
                    className={`relative 
                        px-4 md-px-0 max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto d-hdpi-2:max-w-screen-2/3 `}>
                    <div className="mt-12 mb-0 px-4 d-hdpi-2:mt-vw-12 d-hdpi-2:px-vw-4">
                        <div className={`mb-12 d-hdpi-2:mb-vw-12`}>
                            <SectionTitle
                                section={{
                                    title: 'Reset your Password'
                                }}
                                padding=""
                                size="text-4xl md:text-5xl d-hdpi-2:text-vw-4xl"
                                className=""
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-16 d-hdpi-2:gap-8">
                            <div className="w-full">
                                <div className="mb-16 d-hdpi-2:mb-vw-16">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 d-hdpi-2:gap-4">

                                        <div className="flex flex-col gap-6 mb-4 d-hdpi-2:gap-3 d-hdpi-2:mb-vw-4">
                                            <Block__InputSingle
                                                responsive={true}
                                                whiteBg={true}
                                                type={'password'}

                                                normal


                                                id="password"
                                                margins=""
                                                placeholder={
                                                    'Type new password'
                                                }
                                                // rtl={rtl}
                                                height="h-10 d-hdpi-2:h-vw-10"
                                                fontSize="text-sm d-hdpi-2:text-vw-sm"
                                                label="Password"
                                                labelPos="left"
                                                labelJustify="text-right mr-2 d-hdpi-2:text-mr-2"
                                                labelMargin=""
                                            />


                                        </div>

                                        <div className="flex flex-col gap-6 mb-4 d-hdpi-2:gap-3 d-hdpi-2:mb-vw-4">
                                            <Block__InputSingle
                                                responsive={true}
                                                whiteBg={true}
                                                type={'password'}

                                                normal


                                                id="passwordConfirmation"
                                                margins=""
                                                placeholder={
                                                    'Retype your new password'
                                                }
                                                // rtl={rtl}
                                                height="h-10 d-hdpi-2:h-vw-10"
                                                fontSize="text-sm d-hdpi-2:text-vw-sm"
                                                label="Password"
                                                labelPos="left"
                                                labelJustify="text-right mr-2 d-hdpi-2:text-mr-2"
                                                labelMargin=""
                                            />


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="">
                        <div>
                            <div className="w-full flex-col md:flex-row flex md:items-center justify-end gap-8 d-hdpi-2:gap-4">


                                <ButtonLoad
                                    handleClick={sendPasswordReq}
                                    isLoading={busyCreating}
                                    label={'Save changes'}
                                    margins=""
                                    animate={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
}

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {

        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
