const uiStruct = {
    ui: {
        languages: [
            {
                locale: 'en-US',
                x: 0,
                id: 'en',
                name: 'English',
                short: 'en',
                rtl: false
            },
            {
                locale: 'ar-SA',
                x: 1,
                id: 'ar',
                name: 'العربية',
                short: 'ع',
                rtl: true
            },
        ],

        links: {
            help: 'https://academy.viakonnect.com',
        },

        messages: {
            hello: 'UI_MSG_HELLO',
            welcome: 'UI_MSG_WELCOME',
            welcomeBack: 'UI_MSG_WELCOME_BACK',
        },

        navmain: {
            kreations: {
                title: 'NAVMAIN_KREATIONS',
                icon: 'Grid',
            },
            payout: {
                title: 'NAVMAIN_PAYOUT',
                icon: 'DollarSign',
            },
            profile: {
                title: 'NAVMAIN_PROFILE',
                icon: 'User',
            },
            help: {
                title: 'NAVMAIN_HELP',
                icon: 'HelpCircle',
            },
            signout: {
                title: 'NAVMAIN_SIGNOUT',
                icon: 'LogOut',
            },
        },
    },
};

export default uiStruct;
