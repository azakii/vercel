import ButtonPath from '@/blocks/Button/ButtonPath';
import classNames from 'classnames';
import KreatorCard from '../blocks/Card/KreatorCard';
import { Pill__Logo } from '../blocks/Pills';
import SliderList from '../blocks/SliderList';
import SectionTitle from '../blocks/Title/SectionTitle';
import Row from './Row';


import { connect } from 'react-redux';

import translations from '@/constants/translations';

const breakPoints = {
    default: { width: 320, slides: 2 },
    sm: { width: 640, slides: 2 },
    md: { width: 768, slides: 4 },
    lg: { width: 1024, slides: 4 },
    xl: { width: 1280, slides: 4 }
};

const kreators = [
    {
        image: 'https://ucarecdn.com/2c73a69d-cbad-4d52-987b-fc9f1e3ee3fa/-/preview/360x360/',
        name: 'Maria Ronning',

        link: '/experiences/user/mariaronnn/all'
    },
    {
        image: 'https://ucarecdn.com/7255a900-4a82-4384-aa5d-7c5c1c869bff/-/preview/360x360/',
        name: 'Turki Shoaib',
        link: '/experiences/user/arabiantrails/all'
    },
    {
        image: 'https://ucarecdn.com/10ffd7ea-5dbb-4b06-8e03-dc2d1f306c97/-/preview/360x360/',
        name: 'Leslie Leroy',
        link: '/'
    },
    {
        image: 'https://ucarecdn.com/4382d930-d07f-4248-b852-390026f36b5f/-/preview/360x360/',
        name: 'Jason Bilam',
        link: '/experiences/user/jasonbillamtravel/all'
    }
];

const CallToAction = ({ dataLoading = false, globalState: {lang} }) => {
    return (
        <>
            {/* <div className="absolute inset-0 bg-gray-200 overflow-hidden">
                <img
                    src={'/assets/media/wood2.svg'}
                    //  src={`${data.image}-/preview/300x300/`}
                    className={` object-cover w-full h-full transform`}
                />
            </div> */}
            <div className="bg-white">
                   
                <div
                    className={`relative 
                                 bg-contain bg-no-repeat bg-center`}>
                    {/* <div
                        className={`absolute z-100 top-0 -translate-y-1/2 left-1/2 transform -translate-x-1/2`}>
                        <Pill__Logo />
                    </div> */}

                    <div className="">
                    <div className="w-full py-16 md:py-16 lg:py-16 d-hdpi-2:py-vw-16 landing-gradient-a bg-white ">
                    <div class="px-4 d-hdpi-2:px-vw-4 mb-10 md:mb-10 text-center flex flex-col items-center justify-center">
                        <div class="w-full align-center font-bold tracking-tight leading-none flex-shrink-0-a flex-initial2 md:w-max pb-3 d-hdpi-2:pb-vw-3 text-2xl md:text-3xl d-hdpi-2:text-vw-3xl text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-green-400 to-green-400">
                        Digital Itinerary VS Guided Experiences
                        </div>
                        <div class="mb-1 d-hdpi-2:text-vw-base">We know that everyone isn’t at the same writing level so we will try to help out <br /> with some creative editing and proofing.</div>
                    </div>
                <div
                    className={`relative 
                             md:max-w-3xl lg:max-w-4xl xl:max-w-7xl mx-auto bg-contain bg-no-repeat bg-center py-0 xl:py-8 px-4 xl:px-16 2xl:px-0 d-hdpi-2:max-w-screen-2/3 d-hdpi-2:px-0 d-hdpi-2:py-vw-8`}>
                    <div className="flex flex-col lg:flex-row justify-between md:px-16 lg:px-8 gap-8 md:gap-16 lg:gap-16 xl:gap-6 ">
                        <div className="lg:w-1/2 px-4 md:px-0 2xl:pr-44 d-hdpi-2:pr-vw-24">
                            <img src="/assets/media/av1.png" />
                            {/* <GradientTitle
                                label="Digital vs. Guided"
                                textSize="text-4xl md:text-5xl xl:text-6xl d-hdpi-2:text-vw-6xl"
                                justify=""
                                containerClass=""
                            /> */}
                            <div className="text-2xl md:text-2xl lg:text-2xl lg:mb-4 text-green-400 font-semibold d-hdpi-2:text-vw-4xl d-hdpi-2:mb-vw-4 mt-5">
                                Digital Itinerary
                            </div>
                            <div className="text-green-900 text-base md:text-lg xl:text-xl font-normal mb-8 d-hdpi-2:text-vw-xl d-hdpi-2:mb-vw-8">
                            These are written guides that you can follow on your own without a guide. All the activities and details are included and can be done at your own pace. They take a bit more effort to produce as they include some personal writing and photos.
                            </div>
                            
                        </div>
                        <div className="lg:w-1/2 flex flex-col px-8 md:px-0 ">
                        <img src="/assets/media/av2.png" />
                            {/* <GradientTitle
                                label="Digital vs. Guided"
                                textSize="text-4xl md:text-5xl xl:text-6xl d-hdpi-2:text-vw-6xl"
                                justify=""
                                containerClass=""
                            /> */}
                            <div className="text-2xl md:text-2xl lg:text-2xl lg:mb-4 text-green-400 font-semibold d-hdpi-2:text-vw-4xl d-hdpi-2:mb-vw-4 mt-5">
                                Guided Experiences
                            </div>
                            <div className="text-green-900 text-base md:text-lg xl:text-xl font-normal mb-8 d-hdpi-2:text-vw-xl d-hdpi-2:mb-vw-8">
                            These are packages that include a Kreator/Guide during the experience. You can include activities, transportation, accommodation. They also don't need a full write-up
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
                    </div>
                </div>
            
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({ globalState: state.globalState });

export default connect(mapStateToProps)(CallToAction);