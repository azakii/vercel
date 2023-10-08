import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { updateUsernameAdmin } from '@/helpers/apiServices/user';
import uiStruct from 'constants/uiStruct';
import translations from 'constants/translations';
import Editor from 'components/blocks/Editor';

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
import ErrorBoundary from '@/components/ErrorBoundary';

function SocialLoginUsername(props) {
    const {
        globalState: { lang },
        inModal = true,
        // globalState: { lang },
        auth,
        auth: { user, loading: userLoading },
        actionBtnObj = 'uiStruct.ui.modals.editor.buttons.action',
        cancelBtnObj = 'uiStruct.ui.modals.editor.buttons.cancel',
        updateUsernameAdmin
    } = props;
    const router = useRouter();

    //  const rtl = !!translations[lang].rtl;
    // const countryList = buildCountryData(lang);
    const [busyCreating, setBusyCreating] = useState(false);
    const userDataDefault = {
        username: '',
        email: '',
        password: ''
    };
    const profileDataDefault = {
        first: '',
        last: '',
        displayname: '',
        city: '',
        country: '',
        currency: '',
        avatar: '',
        settings: ''
    };
    const socialDataDefault = {
        instagram: '',
        facebook: '',
        twitter: '',
        tiktok: '',
        youtube: '',
        website: ''
    };
    const [userDataObj, updateUserDataObj] = useState({ ...userDataDefault });
    const [profileDataObj, updateProfileDataObj] = useState({
        ...profileDataDefault
    });
    const [socialDataObj, updateSocialDataObj] = useState({
        ...socialDataDefault
    });
    // const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
    const [formLocked, setFormLocked] = useState(false);
    const [lockedInputs, setLockedInputs] = useState({
        username: true && inModal,
        password: true && inModal,
        email: true && inModal
    });
    const [isLoading, setIsLoading] = useState(true);

    // const resetForm = () => {
    //     updateUserDataObj({
    //         ...userDataDefault
    //     });
    //     updateProfileDataObj({
    //         ...profileDataDefault
    //     });

    //     updateSocialDataObj({
    //         ...socialDataDefault
    //     });
    // };

    const toggleLock = (type) => {
        setLockedInputs({
            ...lockedInputs,
            [type]: !lockedInputs[type]
        });
    };

    const [validationObj, setValidationObj] = useState({
        username: { error: false },
        email: { error: false },
        password: { error: false },
        first: { error: false },
        last: { error: false },
        instagram: { error: false },
        facebook: { error: false },
        twitter: { error: false },
        tiktok: { error: false },
        youtube: { error: false },
        website: { error: false }
    });

    const validateForm = () => {
        const { username, email, password } = userDataObj;
        const socialKeys = [
            'instagram',
            'facebook',
            'twitter',
            'tiktok',
            'youtube',
            'website'
        ];
        const { first, last } = profileDataObj;
        let error = false;
        const tmpErrorObj = {
            username: { error: false },
            email: { error: false },
            password: { error: false },
            first: { error: false },
            last: { error: false },
            instagram: { error: false },
            facebook: { error: false },
            twitter: { error: false },
            tiktok: { error: false },
            youtube: { error: false },
            website: { error: false }
        };
        if (!first.length) {
            tmpErrorObj.first.error = true;
            error = true;
        }
        if (!last.length) {
            tmpErrorObj.last.error = true;
            error = true;
        }

        if (!username.length || !username.match(regexUsername)) {
            tmpErrorObj.username.error = true;
            error = true;
        }
        if (!validateEmail(email)) {
            tmpErrorObj.email.error = true;
            error = true;
        }

        if (password.length && inModal) {
            if (!password.match(regexPassword)) {
                tmpErrorObj.password.error = true;
                error = true;
            }
        } else if (inModal) {
            tmpErrorObj.password.error = false;
        }

        if (!inModal) {
            if (!password.match(regexPassword)) {
                tmpErrorObj.password.error = true;
                error = true;
            }
        }

        socialKeys.forEach((key) => {
            if (socialDataObj[key].length) {
                if (!testValidUrl(socialDataObj[key])) {
                    tmpErrorObj[key].error = true;
                    error = true;
                }
            }
        });

        if (error) {
            setValidationObj({
                ...tmpErrorObj
            });
        }

        return error;
    };

    const updateErrorObj = (key) => {
        if (validationObj[key]) {
            setValidationObj({
                ...validationObj,
                [key]: { error: false }
            });
        }
    };

    const updateUserDataObjInputs = (e, name) => {
        const data =
            name === 'description'
                ? e
                : name === 'email' || name === 'password' || name === 'username'
                    ? e.target.value.replace(/ /g, '')
                    : e.target.value;
        updateUserDataObj({
            ...userDataObj,
            [name]: data
        });

        updateErrorObj(name);
    };

    const updateProfileDataObjInputs = (e, name) => {
        updateProfileDataObj({
            ...profileDataObj,
            [name]: name === 'description' ? e : e.target.value
        });

        updateErrorObj(name);
    };

    const handleCurrencyChange = (val) => {
        updateProfileDataObj({
            ...profileDataObj,
            currency: val
        });
    };

    const handleCountryChange = (val) => {
        updateProfileDataObj({
            ...profileDataObj,
            country: val
        });
    };

    const updateSocialDataObjInputs = (e, name) => {
        updateSocialDataObj({
            ...socialDataObj,
            [name]: name === 'description' ? e : e.target.value
        });

        updateErrorObj(name);
    };

    const updateDescriptionHtml = (html) => {
        if (!isLoading) {
            updateProfileDataObj({
                ...profileDataObj,
                bio: html
            });
        }
    };

    const handleAvatarUpdate = (imageData) => {
        const { url } = imageData[0];
        updateProfileDataObj({ ...profileDataObj, avatar: url || '' });
    };
    const handleDeleteAvatar = () => {
        updateProfileDataObj({ ...profileDataObj, avatar: '' });
    };
    const finishUpdateCreate = () => {
        setBusyCreating(false);
        router.push('/profile');
    };

    const regroupData = () => {
        const fullData = {
            ...userDataObj,
            profile: {
                ...profileDataObj,
                social: socialDataObj
                // country: selectedCountry.id
            }
        };

        if (!validateForm()) {
            const {
                id: userId,
                profile: { _id: profileId }
            } = user;

            setBusyCreating(true);

            updateUsernameAdmin(userId, fullData).then(() => {
                finishUpdateCreate();
            });
        }
    };

    const { username, email, password } = userDataObj;

    const { first, last, displayname, city, currency, country, bio, avatar } =
        profileDataObj;

    const { instagram, facebook, tiktok, youtube, twitter, website } =
        socialDataObj;
    // console.log('avatar', avatar);
    useEffect(() => {
        if (inModal && user) {
            updateUserDataObj({
                username: user.username,
                email: user.email,
                password: ''
            });
            updateProfileDataObj({
                // ...user.profile,
                avatar: user.profile.avatar,
                first: user.profile.first,
                last: user.profile.last,
                city: user.profile.city || '',
                currency: user.profile.currency || 'EUR',
                country: user.profile.country || '000',
                displayname: user.profile.displayname || '',
                bio: user.profile.bio || ''
            });
            updateSocialDataObj({
                instagram: user.profile.social?.instagram || '',
                facebook: user.profile.social?.facebook || '',
                twitter: user.profile.social?.twitter || '',
                tiktok: user.profile.social?.tiktok || '',
                youtube: user.profile.social?.youtube || '',
                website: user.profile.social?.website || ''
            });

            setIsLoading(false);
        }
    }, [user]);

    // useEffect(() => {
    //     if (!auth.isAuthenticated && !auth.loading) {
    //         router.push('/');
    //     }
    // }, [auth]);

    return (
        <ErrorBoundary>
            <Layout>
                <Script>UPLOADCARE_PUBLIC_KEY = '8655037f335d8f4f0419';</Script>
                {!isLoading && user ? (
                    <div className="w-full mt-16 d-hdpi-2:mt-vw-16 d-hdpi-2:text-vw-base mb-16 d-hdpi-2:mb-vw-16">
                        <div
                            className={`relative 
                        px-4 md-px-0 max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto d-hdpi-2:max-w-screen-2/3 `}>
                            <div className="mt-12 mb-0 px-4 d-hdpi-2:mt-vw-12 d-hdpi-2:px-vw-4">
                                <div className={`mb-12 d-hdpi-2:mb-vw-12`}>
                                    <SectionTitle
                                        section={{
                                            title: 'Choose Your Username'
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
                                                        isDisabled={false}
                                                        normal
                                                        error={
                                                            validationObj.username
                                                                .error
                                                        }
                                                        handleChange={(e) =>
                                                            updateUserDataObjInputs(
                                                                e,
                                                                'username'
                                                            )
                                                        }
                                                        id="username"
                                                        margins=""
                                                        value={username}
                                                        placeholder={username}
                                                        // rtl={rtl}
                                                        height="h-10 d-hdpi-2:h-vw-10"
                                                        fontSize="text-sm d-hdpi-2:text-vw-sm"
                                                        label={"Suggested available username: " + username}
                                                        labelPos="top"
                                                        labelJustify="text-right mr-2 d-hdpi-2:mr-vw-2"
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
                                        <div className="flex md:items-center px-6 md:px-0">
                                            <GenericCheckBox
                                                name="terms"
                                                isChecked={formLocked}
                                                setIsChecked={setFormLocked}
                                                bgColor="bg-white"
                                            />
                                            <div className="text-sm d-hdpi-2:text-vw-sm">
                                                Confirm Changes to save
                                            </div>
                                        </div>

                                        <ButtonLoad
                                            disabled={!formLocked}
                                            handleClick={regroupData}
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
                ) : (
                    <div className={``}>
                        <LayoutLoading
                            height="h-screen-1/2"
                            message="Loading User data"
                        />
                    </div>
                )}
            </Layout>
        </ErrorBoundary>
    );
}

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            updateUsernameAdmin
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialLoginUsername);
