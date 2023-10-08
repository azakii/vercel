import Layout from '@/layouts/Layout';

import { Pill__Logo } from 'components/blocks/Pills';
import Link from 'next/link';
import Button from '@/components/blocks/Button/Button';

import { useState, useEffect } from 'react';
import GradientTitle from '@/components/blocks/Title/GradientTitle';
import SliderCreators from '@/sections/SliderCreators';
import SliderCollabs from '@/sections/SliderCollabs';
import LandingCapture from '@/components/landing/LandingCapture';
import { kreatorPath, whatsApp } from '@/constants/globalConsts';

const ContactPage = () => {
    const [tab, setTab] = useState('travel');
    const tabClasses = {
        on: 'border-green-400',
        off: 'text-gray-400 border-transparent hover:border-gray-200'
    };
    const containerClasses = {
        on: 'translate-x-0',
        off: '-translate-x-full'
    };

    return (
        <Layout>
            <div className="w-full py-8 lg:py-16 d-hdpi-2:py-vw-16 landing-gradient bg-green-100a ">
                <div
                    className={`relative 
                             md:max-w-3xl lg:max-w-4xl xl:max-w-7xl mx-auto bg-contain bg-no-repeat bg-center py-0 xl:py-8 px-4 xl:px-16 2xl:px-0 d-hdpi-2:max-w-screen-2/3 d-hdpi-2:px-0 d-hdpi-2:py-vw-8`}>
                    <div className="flex flex-col-reverse lg:flex-row justify-between items-center mb-8 md:px-16 lg:px-0 md:gap-0 ">
                        <div className="lg:w-2/5 flex flex-col px-8 md:px-0 ">
                            <GradientTitle
                                label="Contact us"
                                textSize="text-4xl md:text-5xl xl:text-6xl d-hdpi-2:text-vw-6xl"
                                justify=""
                                containerClass="mb-2 md:mb-4"
                            />

                            <div className="text-green-900 text-base md:text-lg xl:text-xl font-normal mb-8 d-hdpi-2:text-vw-xl d-hdpi-2:mb-vw-8">
                                Our support team is ready to answer all your
                                questions by mail on WhatsApp.
                            </div>
                            <Button
                                as="url"
                                label="Chat with support team"
                                url={`https://wa.me/${whatsApp}`}
                                width="w-full md:w-96 d-hdpi-2:w-vw-96"
                            />
                        </div>
                        <div className="lg:w-1/2 px-4 md:px-0 lg:pl-20 d-hdpi-2:pl-vw-24">
                            <img src="/assets/media/contactus@2x.png" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white ">
                <div
                    className={`relative 
                             md:max-w-3xl lg:max-w-4xl xl:max-w-7xl mx-auto bg-contain bg-no-repeat bg-center py-16 md:pt-24 lg:pt-16 xl:py-16 px-4 xl:px-16 2xl:px-0 d-hdpi-2:max-w-screen-2/3 d-hdpi-2:px-0 d-hdpi-2:py-vw-16`}>
                    <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <Pill__Logo />
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row-reverse justify-center items-center md:mb-8 md:px-16 lg:px-0 lg:gap-16">
                        <div className="lg:w-1/2 flex flex-col items-center px-8 md:px-0">
                            <GradientTitle
                                label="Other inquiries"
                                textSize="text-4xl md:text-5xl xl:text-6xl d-hdpi-2:text-vw-6xl"
                                justify=""
                                containerClass="mb-2 md:mb-4"
                            />

                            <div className="text-green-900 text-base md:text-lg xl:text-xl font-normal d-hdpi-2:text-vw-xl d-hdpi-2:mb-vw-8 text-center">
                                For all non urgent inquiries and questions, you
                                can use the chat widget in the bottom right or
                                send us an email to:{' '}
                                <a
                                    target="_blank"
                                    href="mailto:contact@viakonnect.com">
                                    <span className="font-bold">
                                        contact@viakonnect.com
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactPage;
