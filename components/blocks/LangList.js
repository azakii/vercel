import { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';
import { connect } from 'react-redux';
import { toggleLang } from '@/store/actions/globalState.js';
import { router } from "next/router";

import Cookies from 'js-cookie';


import { handleRowReverse } from '@/helpers/FEutils';
import translations from '@/constants/translations';
import uiStruct from '@/constants/uiStruct';
import { update } from 'lodash';

export function LangList({ lang, rtl, textClass, toggleLang }) {
    const handleData = (data) => {
        return data.name;
    };

    const listData = uiStruct.ui.languages;

    const [selectedLang, setSelectedLang] = useState(uiStruct.ui.languages[0]);
    const [selectedLocale, setSelectedLocale] = useState(uiStruct.ui.languages[0].locale);

    // const [setLang] = useState(uiStruct.ui.languages[0]);
    // const [setRtl] = useState("");
    // const [setTextClass] = useState("");

    // const router = useRouter();

    const handleChange = (selectedLang) => {
        setSelectedLang(selectedLang);
        setSelectedLocale(selectedLang.locale);

        lang = selectedLang;
        rtl = selectedLang.rtl;
        textClass = selectedLang.textClass;

        toggleLang(lang.id, rtl);

        sessionStorage.setItem('locale', selectedLang.x);

        // (async () => {
        //     // document.cookie = "username=John Doe";
        //     Cookies.set('lang', lang.x);
        //     router.reload();
        // })();
    };

    // useEffect(() => {
    //     sessionStorage.setItem('locale', selectedLang.x);
    // }, [selectedLang])

    // useEffect(() => {
    //     setRtl(!!translations[lang]?.rtl);
    // }, [lang]);

    return (
        <>
            <div
                className={`hidden md:flex  items-center relative ${handleRowReverse(rtl).mr
                    }-4 w-32 justify-end`}>
                <span className="block truncate uppercase text-sm">
                    {selectedLang.short}
                </span>
                <Listbox value={selectedLang} onChange={handleChange}>
                    <div className={`z-50  `}>
                        <Listbox.Button
                            className={`focus:outline-none w-12 h-12 rounded-full mx-3
                            flex items-center justify-center text-xl hover:bg-green-100 hover:text-green-600`}>
                            <i className="ri-global-line"></i>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <div
                                className={` bg-white w-32 absolute top-16 ${handleRowReverse(rtl).right
                                    }-0 py-4 overflow-hidden rounded-xl block shadow-2xl-green-400 ring-1 ring-black ring-opacity-5`}>
                                <Listbox.Options className="overflow-auto text-base max-h-80  focus:outline-none sm:text-base">
                                    {listData.map((lData) => (
                                        <Listbox.Option
                                            key={lData.id}
                                            value={lData}
                                            className={({ active }) =>
                                                `${active
                                                    ? 'text-green-900 bg-green-100'
                                                    : 'text-gray-900'
                                                }
cursor-default select-none relative py-2 ${handleRowReverse(rtl).pl}-10 ${handleRowReverse(rtl).pr
                                                }-4`
                                            }>
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={`${lData.name ==
                                                            selectedLang.name
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                            } block truncate ${textClass}`}>
                                                        {handleData(lData)}
                                                    </span>
                                                    {lData.name ==
                                                        selectedLang.name ? (
                                                        <span
                                                            className={`${active
                                                                ? 'text-green-400'
                                                                : 'text-green-400'
                                                                }
absolute inset-y-0 ${handleRowReverse(rtl).left}-0 flex items-center ${handleRowReverse(
                                                                    rtl
                                                                ).pl
                                                                }-3`}>
                                                            <CheckIcon
                                                                className="w-5 h-5 d-hdpi-2:w-vw-w-vw-6 d-hdpi-2:w-vw-h-vw-6"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        </>
    );
}

const mapStateToProps = (state) => ({
    lang: state.globalState.lang,
    rtl: state.globalState.rtl,
    textClass: state.globalState.textClass,
});

const mapDispatchToProps = {
    toggleLang
}

export default connect(mapStateToProps, mapDispatchToProps)(LangList);
