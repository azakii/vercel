import { Pill__Logo, Pill__Experience } from '@/blocks/Pills';

import ButtonCard from '@/blocks/Button/ButtonCard';
import { randomItem } from '@/helpers/FEutils';
import Avatar from 'components/specialty/Avatar';
import Link from 'next/link';
import KreatorBadgeStatic from '../blocks/KreatorBadgeStatic';
import KreatorBadgeStaticFlat from '../blocks/KreatorBadgeStaticFlat';
import SliderList from '@/blocks/SliderList';

const breakPoints = {
    default: { width: 320, slides: 2 },
    sm: { width: 640, slides: 2 },
    md: { width: 768, slides: 4 },
    lg: { width: 1024, slides: 4 },
    xl: { width: 1280, slides: 4 }
};

const Showcase = ({
    profile,
    data,
    children,
    pill,
    dataLoading = false,
    collection = 'experience',
    darkenMobile,
    dataFeatures
}) => {
    const dark = !!data?.dark_theme; 
    const blur = collection != 'showcase' ? 'filter blur-2xl transform scale-110' : '';
    const overlay =
        collection != 'showcase' ? (
            <div
                // style={{ zIndex: '-49' }}
                className={`absolute inset-0 ${
                    dark ? 'bg-gray-600 opacity-50' : 'bg-glass-100 opacity-50'
                }`}></div>
        ) : null;
    const mobileOverlay = darkenMobile ? (
        <div
            // style={{ zIndex: '-49' }}
            className={`md:hidden absolute inset-0 bg-black opacity-50 mix-blend-multiply`}></div>
        ) : null;
    return !dataLoading ? (
        <div
            className={`w-full lg:h-128 d-hdpi-2:h-vw-128 relative flex justify-between lg:flex-row`}>
            {/* div that will house bg + overlay */}
            <div className="absolute inset-0 bg-white overflow-hidden">
                <img
                    // src={data.image}
                    src={'assets/media/herobanner_bg.svg'}
                    //  src={`${data.image}-/preview/300x300/`}
                    className={` object-cover w-full h-full opacity-30 ${
                        dark ? 'brightness-50' : 'opacity-30'
                    } ${blur} `}
                />
                {overlay}
                {mobileOverlay}
            </div>

            {pill ? (
                // <div
                //     className={`absolute z-100 ${
                //         pill == 'top'
                //             ? 'top-0 -translate-y-1/2'
                //             : 'bottom-0 translate-y-1/2'
                //     }                        
                //     left-1/2 transform -translate-x-1/2`}>
                //     <Pill__Logo />
                // </div>
                <></>
            ) : null}
            {collection == 'experience' && data.blackPill && (
                // <div
                //     className={`absolute z-100 bottom-0 translate-y-1/2                           
                //     left-1/2 transform -translate-x-1/2`}>
                //     <Pill__Experience label={data.blackPillTxt} />
                // </div>
                <></>
            )}
            {true && (
            
                <div className={`z-100 mb-12 px-5 lg:px-12 white-text xl:pl-24 xl:pr-12 2xl:pl-40 2xl:pr-20 d-hdpi-2:pl-vw-40 d-hdpi-2:pr-vw-20  w-full lg:w-screen flex`}>
                    <div className={`z-100 px-4 mt-8 lg:mt-20 d-hdpi-2:px-vw-4 d-hdpi-2:mt-vw-20 justify-center`}>
                        {!children ? (
                            <>
                                {data?.username && (
                                    <>
                                        <KreatorBadgeStatic
                                         author={data.user_id}
                                        />
                                    </>
                                )}

                                <div
                                    className={`inline-flex ${
                                        dark
                                            ? 'text-green-400'
                                            : 'text-green-500'
                                    } font-bold text-2xl lg:text-3xl d-hdpi-2:text-vw-3xl tracking-tight leading-tight flex-shrink-0 flex-initial mb-2 d-hdpi-2:mb-vw-2`}>
                                    {data.title}
                                </div>
                                <div
                                    className={`${
                                        dark ? 'text-gray-800' : 'text-gray-800'
                                    } mt-2 text-xl lg:text-2xla lg:text-4xl d-hdpi-2:text-vw-4xl lg:font-bold lg:leading-tight mb-8 d-hdpi-2:mb-vw-8 whitespace-normal`}>
                                    {data.headline}
                                </div>
                                {data.description && (
                                    <div
                                        className={`${
                                            dark
                                                ? 'text-gray-800'
                                                : 'text-gray-800'
                                        } text-base d-hdpi-2:text-vw-base mb-8 d-hdpi-2:mb-vw-8`}
                                        dangerouslySetInnerHTML={{
                                            __html: data.description
                                        }}
                                    />
                                )}

                            <form className="w-full pr-10">   
                                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm border-0 text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none rounded-full" placeholder="Search by Destination, Kreator...." required />
                                    <button type="submit" className="text-black font-normal absolute ease-in-out bg-gradient-to-r from-green-300 via-green-400 to-green-500  font-bold text-green-800 hover:bg-gray-900 transition-all hover:text-white hover:bg-gray-900 hover:text-white right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:focus:ring-blue-800 rounded-r-full">Search</button>
                                </div>
                            </form>

                                {/* {data.button && (
                                    <ButtonCard
                                        url={data.url}
                                        icon={
                                            'las la-arrow-right d-hdpi-2:mt-vw-0.5'
                                        }
                                        label={data.label}
                                        darkMode={dark}
                                    />
                                )} */}
                            </>
                        ) : (
                            children
                        )}
                    </div>
                    <div
                    className={`z-100 mb-12 px-5 lg:px-12 xl:pl-24 xl:pr-12 2xl:pl-40 2xl:pr-20 d-hdpi-2:pl-vw-40 d-hdpi-2:pr-vw-80  w-full lg:w-screen-2/5 flex-none`}>
                    <div
                        className={`ahmed z-100 px-4 mt-8 lg:mt-20 d-hdpi-2:px-vw-4 d-hdpi-2:mt-vw-80`}>
                            <>
                            <SliderList
                                // classes={classes}
                                randomStart={true}
                                useRow={false}
                                loop={true}
                                margins={'mt-0 mb-0 lg:mt-0 lg:mb-0'}
                                padding="py-4a d-hdpi-2:py-vw-4a"
                                breakPoints={breakPoints}
                                // section={sectionTitles}
                                dataLoading={dataLoading}>
                                    
                                    {dataFeatures
                                .filter((item, index) => {
                                    if (filteredCount)
                                        return index <= filteredCount - 1;
                                    else return true;
                                })
                                .map((item) => {
                                    return missing && purchasedView ? (
                                        <ResultCardMissing
                                            missing={true}
                                            purchasedView={purchasedView}
                                            myKey={item.id}
                                            key={item.id}
                                            data={item}
                                        />
                                    ) : (
                                        <ResultCard
                                            missing={true}
                                            purchasedView={purchasedView}
                                            myKey={item.id}
                                            key={item.id}
                                            data={item}
                                        />
                                    );
                                })}
                            </SliderList>
                             
                            </>
                    </div>
                    </div>
                </div>
            )}
            {collection != 'showcase' && (
                <>
                    <div
                        className="hidden lg:block z-50 flex-none lg:w-screen-3/7 h-64 lg:h-full overflow-hidden rounded-l-fulla "
                        style={{ borderRadius: '100px 0 0 100px' }}>
                        <img
                            alt="Placeholder"
                            className="object-cover d-hdpi-2:object-right lg:object-right w-full h-full transform lg:rounded-l-fulla lg:scale-150a 2xl:translate-x-0 "
                            src={data.image}
                        />
                    </div>
                    <div className=" lg:hidden z-50 flex-none lg:w-1/2 h-64 lg:h-full overflow-hidden rounded-b-2xl">
                        <img
                            alt="Placeholder"
                            className="rounded-b-2xl object-cover object-right w-full h-full transform "
                            src={data.image}
                        />
                    </div>
                </>
            )}
        </div>
    ) : (
        <div
            className={`w-full h-128 d-hdpi-2:h-vw-128 relative pt-1 d-hdpi-2:pt-vw-1 bg-gray-300 animate-pulse`}></div>
    );
};

export default Showcase;
