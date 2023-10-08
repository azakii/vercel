const jose = require('jose');
import { logout, socialLogin, register } from '@/store/actions/auth';
import { createDataAdmin, deleteDataAdmin } from '@/helpers/apiServices/user';
import { useRouter } from 'next/router';
import {
    toggleLang,
    toggleNav,
    toggleCart,
    toggleAuthModal,
    setAuthPage
} from '@/store/actions/globalState';

export default async (req, res) => {
    var router = null; //useRouter();
    
    if (req.method === 'POST') {
        try {

            var credentialResponse = req.body;
            // console.log(credentialResponse);

            const JWKS = jose.createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

            jose.jwtVerify(credentialResponse.id_token, JWKS, {
                // issuer: 'https://accounts.google.com',
                audience: 'com.viakonnect.auth.prod',
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

            });

            res.status(200).json({status: 1});

        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
};
