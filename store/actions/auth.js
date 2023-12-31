import axios from 'axios';
import { toast } from 'react-toastify';
import { ErrorSuccessLang } from 'helpers/errors';
import * as types from 'store/actions/types';
import { defaultProfile } from '@/constants/defaultObjs';

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    USER_PROFILE_MISSING,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    AUTH_ERROR,
    AUTH_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    RESET_FAIL,
    RESET_SUCCESS,
    LOGOUT,
    AUTH_CLEAR_ERRORS
} from './types';
import setAuthToken from '@/helpers/apiServices/setAuthToken';
import ToastMessage from '@/components/blocks/ToastMessage';
import { toggleAuthModal } from './globalState';

// Load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/me`
            );

            if (res.data.profile.first.length && res.data.profile.last.length) {
                dispatch({
                    type: USER_LOADED,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: USER_PROFILE_MISSING,
                    payload: res.data
                });
            }
        } catch (err) {
            dispatch({
                type: AUTH_ERROR,
                payload: null
            });
        }
    } else
        dispatch({
            type: AUTH_ERROR,
            payload: null
        });
};

// clear errors
export const clearLoginErrors = () => async (dispatch) => {
    dispatch({
        type: AUTH_CLEAR_ERRORS
    });
};

// Register User
export const register =
    ({ username, email, password, profile }) =>
        async (dispatch) => {
            dispatch({
                type: AUTH_LOADING
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({ username, email, password, profile });

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`,
                    body,
                    config
                );

                // toast.success(<ErrorSuccessLang errorId='REGISTER_SUCCESS' />, {
                //     hideProgressBar: true,
                //     autoClose: 1500,
                // });
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: res.data
                });

                dispatch(loadUser());
            } catch (err) {
                if (err.response) {
                    const errorObj = err.response.data;
                    console.log('ERROR STATUS CODE:', errorObj);
                    if (errorObj.statusCode == '403') {
                        toast.error(<ErrorSuccessLang errorId="FORBIDDEN" />, {
                            hideProgressBar: true,
                            autoClose: 2500
                        });
                    }
                    const errors = errorObj.data && errorObj.data[0]?.messages;
                    if (errors) {
                        errors.forEach((error) =>
                            toast.error(<ErrorSuccessLang errorId={error.id} />, {
                                hideProgressBar: true,
                                autoClose: 2500
                            })
                        );
                    }
                    // console.log('err', err.response.data.msg);
                    dispatch({
                        type: REGISTER_FAIL,
                        payload: errors
                            ? errors.map((error) => error.message)
                            : [errorObj.message]
                    });
                } else if (err.request) {
                    // console.log('error no resp from server', err.request);
                    toast.error(<ErrorSuccessLang errorId="NETWORKERROR" />);
                    dispatch({
                        type: REGISTER_FAIL,
                        payload: ['networkError']
                    });
                } else {
                    // console.log('Error', err.message);
                    toast.error(<ErrorSuccessLang errorId="DEFAULTERROR" />);
                    dispatch({
                        type: REGISTER_FAIL,
                        payload: ['somethingWrong']
                    });
                }
                return err;
            }
        };

export const socialLogin =
    ({ id, first, last, name, email, picture, provider, register, createDataAdmin, deleteDataAdmin, setAuthPage, router, toggleNav, ...props }) =>
        async (dispatch) => {
            dispatch({
                type: AUTH_LOADING
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const identifier = email;
            const password = id;

            const body = JSON.stringify({ identifier, password });

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
                    body,
                    config
                );
                toast.success(
                    <ToastMessage
                        icon="😊"
                        msg="Welcome back! we missed you"
                        alignTop={false}
                    />,
                    {
                        hideProgressBar: true,
                        autoClose: 2500
                    }
                );
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                });

                dispatch(loadUser());
            } catch (err) {
                if (err.response) {
                    const errorObj = err.response.data;
                    console.log('ERROR STATUS CODE:', errorObj);
                    if (errorObj.statusCode == '403') {
                        toast.error(
                            <ToastMessage
                                icon="😕"
                                msg="Hmm...it seems you're not allowed to make that request"
                                alignTop={true}
                                color="text-white"
                            />,
                            {
                                hideProgressBar: true,
                                autoClose: 2500
                            }
                        );
                        dispatch({
                            type: LOGIN_FAIL,
                            payload: errors
                                ? errors.map((error) => error.message)
                                : [errorObj.message]
                        });
                    }
                    const errors = errorObj.data && errorObj.data[0]?.messages;
                    if (errors) {       // New fast-login user ?
                        toast.success(
                            <ToastMessage
                                icon="😊"
                                msg="This is your first login, let's finish your profile !"
                                alignTop={false}
                            />,
                            {
                                hideProgressBar: true,
                                autoClose: 2500
                            }
                        );


                        const username = last + String(id).slice(2, 5);
                        defaultProfile.avatar = picture;
                        defaultProfile.displayname = name;
                        defaultProfile.first = first;
                        defaultProfile.last = last;

                        createDataAdmin(types.CREATE_PROFILE, 'profiles', defaultProfile)
                            .then((res) => {
                                if (!res.error) {
                                    register({
                                        password,
                                        username,
                                        email,
                                        profile: res.value.data._id
                                    })
                                        .then((regResolution) => {
                                            if (regResolution?.response?.data?.error) {
                                                deleteDataAdmin(
                                                    types.DELETE_PROFILE,
                                                    'profiles',
                                                    res.value.data._id
                                                );
                                            } else {
                                                // toggleNav(0);
                                                if (router)
                                                    router.push('/socialloginusername');

                                            }
                                        });
                                }
                            });

                        // errors.forEach((error) =>
                        //     toast.error(
                        //         <ToastMessage
                        //             icon="🧐"
                        //             msg="Invalid email or password"
                        //             alignTop={false}
                        //             color="text-white"
                        //         />,
                        //         {
                        //             hideProgressBar: true,
                        //             autoClose: 2500
                        //         }
                        //     )
                        // );
                    }
                    // console.log('err', err.response.data.msg);
                    // dispatch({
                    //     type: LOGIN_FAIL,
                    //     payload: errors
                    //         ? errors.map((error) => error.message)
                    //         : [errorObj.message]
                    // });
                } else if (err.request) {
                    // console.log('error no resp from server', err.request);
                    toast.error(
                        <ToastMessage
                            icon="🐛"
                            msg="The server is bugging. Sorry about that"
                            alignTop={true}
                            color="text-white"
                        />,
                        {
                            hideProgressBar: true,
                            autoClose: 2500
                        }
                    );
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: ['networkError']
                    });
                } else {
                    // console.log('Error', err.message);
                    toast.error(
                        <ToastMessage
                            icon="🙄"
                            msg="Oops. Something went wrong. That's all we know"
                            alignTop={true}
                            color="text-white"
                        />,
                        {
                            hideProgressBar: true,
                            autoClose: 2500
                        }
                    );
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: ['somethingWrong']
                    });
                }
            }
        };

// Reset User Password
export const sendReset =
    ({ email }) =>
        async (dispatch) => {
            dispatch({
                type: AUTH_LOADING
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({ email });

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
                    body,
                    config
                );
                toast.success(
                    <ToastMessage
                        icon="👀"
                        msg="Check your email inbox for resetting instructions"
                        alignTop={false}
                    />,
                    {
                        hideProgressBar: true,
                        autoClose: 2500
                    }
                );

                dispatch({
                    type: RESET_SUCCESS,
                    payload: ""
                });


                // dispatch(loadUser());
            } catch (err) {
                console.log(err);
                toast.error(
                    <ToastMessage
                        icon="😕"
                        msg="Hmm...it seems you're not allowed to make that request"
                        alignTop={true}
                        color="text-white"
                    />,
                    {
                        hideProgressBar: true,
                        autoClose: 2500
                    }
                );

                dispatch({
                    type: RESET_FAIL,
                    payload: ""
                });
            }
        };

// Login User
export const login =
    ({ identifier, password }) =>
        async (dispatch) => {
            dispatch({
                type: AUTH_LOADING
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({ identifier, password });

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
                    body,
                    config
                );
                toast.success(
                    <ToastMessage
                        icon="😊"
                        msg="Welcome back! we missed you"
                        alignTop={false}
                    />,
                    {
                        hideProgressBar: true,
                        autoClose: 2500
                    }
                );
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                });

                dispatch(loadUser());
            } catch (err) {
                if (err.response) {
                    const errorObj = err.response.data;
                    console.log('ERROR STATUS CODE:', errorObj);
                    if (errorObj.statusCode == '403') {
                        toast.error(
                            <ToastMessage
                                icon="😕"
                                msg="Hmm...it seems you're not allowed to make that request"
                                alignTop={true}
                                color="text-white"
                            />,
                            {
                                hideProgressBar: true,
                                autoClose: 2500
                            }
                        );
                    }
                    const errors = errorObj.data && errorObj.data[0]?.messages;
                    if (errors) {
                        errors.forEach((error) =>
                            toast.error(
                                <ToastMessage
                                    icon="🧐"
                                    msg="Invalid email or password"
                                    alignTop={false}
                                    color="text-white"
                                />,
                                {
                                    hideProgressBar: true,
                                    autoClose: 2500
                                }
                            )
                        );
                    }
                    // console.log('err', err.response.data.msg);
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: errors
                            ? errors.map((error) => error.message)
                            : [errorObj.message]
                    });
                } else if (err.request) {
                    // console.log('error no resp from server', err.request);
                    toast.error(
                        <ToastMessage
                            icon="🐛"
                            msg="The server is bugging. Sorry about that"
                            alignTop={true}
                            color="text-white"
                        />,
                        {
                            hideProgressBar: true,
                            autoClose: 2500
                        }
                    );
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: ['networkError']
                    });
                } else {
                    // console.log('Error', err.message);
                    toast.error(
                        <ToastMessage
                            icon="🙄"
                            msg="Oops. Something went wrong. That's all we know"
                            alignTop={true}
                            color="text-white"
                        />,
                        {
                            hideProgressBar: true,
                            autoClose: 2500
                        }
                    );
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: ['somethingWrong']
                    });
                }
            }
        };

// Logout
export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
        payload: null
    });
    toast.success(
        <ToastMessage icon="❤️" msg="Don't be a stranger" alignTop={false} />,
        {
            hideProgressBar: true,
            autoClose: 2500
        }
    );
};

export const createProfile =
    ({ first, last, country, user }) =>
        async (dispatch) => {
            dispatch({
                type: AUTH_LOADING
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const settings = {
                tour: true,
                tooltips: true
            };
            const body = JSON.stringify({ first, last, country, user, settings });

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/profiles`,
                    body,
                    config
                );

                // toast.success(<ErrorSuccessLang errorId='PROFILE_SUCCESS' />, {
                //     hideProgressBar: true,
                //     autoClose: 1500,
                // });
                dispatch({
                    type: USER_PROFILE_SUCCESS,
                    payload: res.data
                });

                dispatch(loadUser());
            } catch (err) {
                if (err.response) {
                    const errorObj = err.response.data;
                    console.log('ERROR STATUS CODE:', errorObj);
                    if (errorObj.statusCode == '403') {
                        toast.error(<ErrorSuccessLang errorId="FORBIDDEN" />, {
                            hideProgressBar: true,
                            autoClose: 2500
                        });
                    }
                    const errors = errorObj.data && errorObj.data[0]?.messages;
                    if (errors) {
                        errors.forEach((error) =>
                            toast.error(<ErrorSuccessLang errorId={error.id} />)
                        );
                    }

                    dispatch({
                        type: USER_PROFILE_FAIL,
                        payload: errors
                            ? errors.map((error) => error.message)
                            : [errorObj.message]
                    });
                } else if (err.request) {
                    // console.log('error no resp from server', err.request);
                    toast.error(<ErrorSuccessLang errorId="NETWORKERROR" />);
                    dispatch({
                        type: USER_PROFILE_FAIL,
                        payload: ['networkError']
                    });
                } else {
                    // console.log('Error', err.message);
                    toast.error(<ErrorSuccessLang errorId="DEFAULTERROR" />);
                    dispatch({
                        type: USER_PROFILE_FAIL,
                        payload: ['somethingWrong']
                    });
                }
            }
        };
