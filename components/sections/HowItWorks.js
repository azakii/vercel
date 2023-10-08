import { Pill__Logo } from 'components/blocks/Pills';
import Link from 'next/link';
import Button from '@/components/blocks/Button/Button';

import { useState, useEffect } from 'react';
import GradientTitle from '@/components/blocks/Title/GradientTitle';
import SliderCreators from '@/sections/SliderCreators';
import SliderCollabs from '@/sections/SliderCollabs';
import LandingCapture from '@/components/landing/LandingCapture';
import { kreatorPath } from '@/constants/globalConsts';

const HowItWorks = () => {
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
            <>
            <div className="w-full bg-white pb-0">
                <div
                    className={`relative 
                          md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto bg-contain bg-no-repeat bg-center pb-8 md:pb-16 pt-16 md:pt-16 px-0 lg:px-8 w-80 md:w-full d-hdpi-2:max-w-screen-2/3 `}>
                   
                    <div className="w-full flex flex-col px-0 md:px-8 lg:px-0 ">
                        <GradientTitle
                            label="How does it work?"
                            textSize="text-4xl md:text-5xl xl:text-6xl d-hdpi-2:text-vw-6xl text-center"
                            justify="justify-center"
                            extraClasses />

                        <div className="max-w-lg w-full mx-auto flex items-center border-b border-gray-200 mb-8 md:mb-0 mt-4 md:mt-4 d-hdpi-2:mt-vw-12 d-hdpi-2:max-w-screen-1/3 ">
                            <div
                                onClick={() => setTab('travel')}
                                className={`cursor-pointer w-1/3 h-12 flex items-center justify-center border-b-4 px-2 uppercase text-sm d-hdpi-2:text-vw-sm d-hdpi-2:border-b-2 d-hdpi-2:h-vw-12 d-hdpi-2:px-vw-4 ${tab === 'travel'
                                        ? tabClasses.on
                                        : tabClasses.off}`}>
                                For Travelers
                            </div>
                            <div
                                onClick={() => setTab('kreate')}
                                className={`cursor-pointer w-1/3 h-12 flex items-center justify-center border-b-4 px-2 uppercase text-sm d-hdpi-2:text-vw-sm d-hdpi-2:border-b-2 d-hdpi-2:h-vw-12 d-hdpi-2:px-vw-4 ${tab === 'kreate'
                                        ? tabClasses.on
                                        : tabClasses.off}`}>
                                For Kreators
                            </div>
                            <div
                                onClick={() => setTab('earn')}
                                className={`cursor-pointer w-1/3 h-12 flex items-center justify-center border-b-4 px-2 uppercase text-sm d-hdpi-2:text-vw-sm d-hdpi-2:border-b-2 d-hdpi-2:h-vw-12 d-hdpi-2:px-vw-4 ${tab === 'earn'
                                        ? tabClasses.on
                                        : tabClasses.off}`}>
                                Earn with Konnect
                            </div>
                        </div>
                        <div className="w-full rounded-3xl bg-white-a overflow-hidden d-hdpi-2:rounded-vw-3xl">
                            <div
                                className={`p-4 xl:pb-16 xl:px-16 flex flex-nowrap gap-8 md:gap-8 lg:gap-8 xl:gap-32 transform-gpu transition-all duration-500 ease-in-out-expo-hard d-hdpi-2:gap-16 d-hdpi-2:px-vw-16 ${tab === 'travel'
                                        ? containerClasses.on
                                        : containerClasses.off}`}>
                                <div className="flex flex-nowrap flex-col lg:flex-row lg:justify-center gap-4 lg:gap-8 xl:gap-16 d-hdpi-2:gap-8 ">
                                    <OptionCard
                                        title="Explore"
                                        image="/assets/media/choosing.png">
                                        Browse the Konnect marketplace and
                                        explore a growing collection of both
                                        digital and guided experiences made by
                                        locals and travelers.
                                    </OptionCard>
                                    <OptionCard
                                        title="Choose"
                                        image="/assets/media/aiming.png">
                                        Our marketplace was designed to make it
                                        easy to find and choose the right
                                        experience for you, in a format that
                                        covers the what, where, when, and how
                                        and everything in between.
                                    </OptionCard>
                                    <OptionCard
                                        title="Enjoy"
                                        image="/assets/media/running.png">
                                        Access guides on the go and take
                                        advantage of direct links to location
                                        and relevant information from a
                                        traveler’s perspective.
                                    </OptionCard>
                                </div>

                                <div className="flex flex-col lg:flex-row lg:justify-center gap-4 lg:gap-8 xl:gap-16 ">
                                    <OptionCard
                                        title="Kreate"
                                        image="/assets/media/create@2x.png">
                                        Use our uniquely built tool to build a
                                        flexible experience, digital or guided.
                                    </OptionCard>
                                    <OptionCard
                                        title="Share"
                                        image="/assets/media/share@2x.png">
                                        Share content with your followers
                                        directly through your social media
                                        accounts.
                                    </OptionCard>
                                    <OptionCard
                                        title="Earn"
                                        image="/assets/media/earn@2x.png">
                                        Sell your Kreations to the world. We'll
                                        take care of all the rest.
                                    </OptionCard>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:justify-center gap-4 lg:gap-8 xl:gap-16 ">
                                    xxxxx
                                </div>
                            </div>
                        </div>
                       
                        {/* <div className="w-12 border-b-4 border-green-400 mx-auto mt-16 mb-16"></div> */}
                    </div>
                </div>
            </div>
            
            </>
    );
};

export default HowItWorks;

const OptionCard = ({ title, children, image }) => {
    return (
        <div className="w-full lg:w-72 xl:w-80 mb-4 md:mb-0  flex flex-col md:flex-row lg:flex-col md:gap-8 lg:gap-0 d-hdpi-2:w-vw-80">
            <div className="w-72 md:w-80 lg:w-72 md:h-64 flex items-center justify-center d-hdpi-2:w-vw-72 d-hdpi-2:h-vw-96">
                <img src={image} className="" />
            </div>
            <div className="w-72 md:w-80 lg:w-72 md:mt-16 lg:mt-0 px-4 xl:px-0 d-hdpi-2:w-vw-72 d-hdpi-2:mt-0">
                {/* <GradientTitle label={title} textSize="text-4xl" /> */}
                <div className="text-2xl md:text-3xl lg:text-4xl lg:mb-4 text-green-400 font-semibold d-hdpi-2:text-vw-4xl d-hdpi-2:mb-vw-4">
                    {title}
                </div>
                <div className="text-base text-gray-600 d-hdpi-2:text-vw-base">
                    {children}
                </div>
            </div>
        </div>
    );
};
