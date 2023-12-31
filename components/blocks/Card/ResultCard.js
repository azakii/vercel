import React from 'react';
import KreatorBadge from '@/blocks/KreatorBadge';
import Link from 'next/link';
import { User, Clock, MapPin, Users } from 'lucide-react';
import Icons from '../Icon/Icons';
import { country, findLowestPrice } from '@/helpers/LocaleHelper';
import { NEXT_PUBLIC_KREATOR_BASE_URL } from '@/constants/public';
import moment from 'moment';
import classNames from 'classnames';
import PillType from './PillType';

import { connect } from 'react-redux';

import translations from '@/constants/translations';


const baseUrl = {
    kreatorPage: '/kreator',
    experiencePage: '/experiences',
    avatar: '/assets/media/kreators',
    experienceImageFeatured: '/assets/media/results'
};
const currencyPrefix = '$';

const ResultCard = ({ purchasedView = false, data, containerClass, myKey, globalState: {lang} }) => {
    const {
        name: title,
        people,
        travelDate,
        swellbypass,
        price,
        slug,
        creator: {
            username = '',
            first = '',
            last = '',
            avatar = '',
            displayname = ''
        } = {},
        content: {
            experience_id,
            featured_image,
            type,
            days,
            destinations
        } = {}
    } = data;

    const user = {
        username,
        first,
        last,
        avatar,
        displayname
    };

    // const { destination, days, featured_image, title } = short_content?.destination ? short_content : { destination: '', days:1, featured_image: '', title: '' };

    // const EmptyData = <span className="w-20 bg-gray-300 rounded-full h-2" />;
    const ContentDays = days ? (
        <span key={myKey}> {`${days}  ${days > 1 ? 'Days' : 'Day'}`}</span>
    ) : (
        <div key={myKey}>EmptyData</div>
    );

    // const ContentPrice = content?.price ? (
    //     <span>{`${currencyPrefix} ${content.price}`}</span>
    // ) : (
    //     EmptyData
    // );

    // const contentPrice = type === 'DIGITAL' ? experience_price.price : findLowestPrice(experience_price.price)

    const makeLink = (myKey) => {
        const linkJsx = (
            <>
                {featured_image ? (
                <>
                    <img key={myKey}
                        alt="Placeholder"
                        // className={` w-full h-56 md:h-36 lg:h-44 xl:h-56 relative rounded-xl overflow-hidden  bg-gray-200 `}
                        className="rounded-xl object-cover w-full h-56 md:h-75 lg:h-75 xl:h-75 2xl:h-75 d-hdpi-2:h-vw-75 d-hdpi-2:rounded-vw-xl"
                        // className="rounded-xl object-cover w-full h-40 xs360:h-44 xs390:h-52 xs410:h-56 sm:h-64 md:h-64 lg:h-64 xl:h-72 2xl:h-96"
                        // data-blink-src={featured_image || ''}
                        src={featured_image || ''}
                    />
                    
                </>  
                ) : (
                    <div key={myKey}
                        // className="rounded-xl bg-gray-200 w-full h-40 xs360:h-44 xs390:h-52 xs410:h-56 sm:h-64 md:h-64 lg:h-64 xl:h-72 2xl:h-96"
                        className="rounded-xl bg-gray-200 w-full h-56 md:h-36 lg:h-44 xl:h-36 2xl:h-52 d-hdpi-2:h-vw-52 d-hdpi-2:rounded-vw-xl">
                        <div className="relative h-full">
                            <div className="text-xs d-hdpi-2:text-vw-xs whitespace-nowrap tracking-widest uppercase absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Icons iName="IMAGEALT2" />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
        if (purchasedView) {
            return (
                <a key={myKey}
                    href={`${NEXT_PUBLIC_KREATOR_BASE_URL}/purchased/${experience_id}/0`}
                    target="_blank">
                    {linkJsx}
                </a>
            );
        }

        return (
            <Link href={`${baseUrl.experiencePage}/${slug}`}>
                {linkJsx}
            </Link>
        );
    };

    return (
        <div
            key={myKey}
            className={`my-3 px-2 w-full md:w-1/3a lg:w-1/4a xl:w-1/5a lg:my-3 lg:px-2 ${containerClass} d-hdpi-2:my-vw-4 d-hdpi-2:px-vw-2`}>
            <div className="group-scope relative bg-transparent transition-all duration-300 transform-gpu overflow-hidden rounded-xl d-hdpi-2:rounded-vw-xl hover:shadow-xl hover:-translate-y-1 hover:bg-white">
                <KreatorBadge key={myKey} author={user} baseUrl={baseUrl} />
                <div>{makeLink(myKey)}</div>
                <div>
                    {!purchasedView && (
                            (<Link
                                href={`${baseUrl.experiencePage}/${slug}`}
                                className="cardprice absolute z-100 inline-block focus:outline-none transition-colors duration-300 flex justify-center items-center mt-6 w-full rounded-lg d-hdpi-2:rounded-vw-lg border-2 d-hdpi-2:border border-green-400 h-10 text-black text-sm font-bold tracking-tight  d-hdpi-2:text-vw-sm d-hdpi-2:mt-vw-6 d-hdpi-2:h-vw-10 hover:bg-green-400">

                                {/* <span className="mr-2 font-normal text-xs d-hdpi-2:text-vw-xs">
                                    {type.toUpperCase() === 'DIGITAL'
                                        ? translations[lang].getItFor
                                        : translations[lang].starting}
                                </span> */}
                                <span>
                                    {`${currencyPrefix} `}
                                    {price}
                                </span>
                                {type.toUpperCase() === 'DIGITAL' ? (
                                    ''
                                ) : (
                                    <span className="ml-1 flex gap-1 text-xs font-medium d-hdpi-2:text-vw-xs d-hdpi-2:ml-vw-1 d-hdpi-2:gap-0.5"></span>
                                )}

                            </Link>)
                        )}
                </div>
                
                {purchasedView && swellbypass && (
                    <div
                        className={` absolute flex top-4 right-4 overflow-hidden rounded-full h-8 d-hdpi-2:h-vw-8 d-hdpi-2:left-vw-4 d-hdpi-2:top-vw-4`}>
                        <div className="h-8 d-hdpi-2:h-vw-8 bg-gray-900 z-0 text-xs text-white flex items-center px-4 rounded-full d-hdpi-2:text-vw-xs d-hdpi-2:pl-vw-10 d-hdpi-2:pr-vw-4">
                            Trial
                        </div>
                    </div>
                )}
                <div className="p-2 sm:p-4 mt-2 sm:mt-0 d-hdpi-2:p-vw-4">
                    <div className="flex items-center justify-between leading-tight text-black font-sans text-xs md:text-sm d-hdpi-2:text-vw-sm">
                        <span className="flex line-clamp-2 h-9 d-hdpi-2:h-vw-9 overflow-hidden">
                            {title ? (
                                title
                            ) : (
                                <span className="flex">
                                    <span className="w-48 d-hdpi-2:w-vw-48 bg-gray-300 rounded-xl d-hdpi-2:rounded-vw-xl h-3 d-hdpi-2:h-vw-3" />
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="mt-2 flex flex-row justify-between font-sans text-xs md:text-xxs lg:text-xs d-hdpi-2:text-vw-xs text-gray-900 d-hdpi-2:mt-vw-2">
                        <div className="flex items-center mr-4 py-1 d-hdpi-2:mr-vw-4 d-hdpi-2:py-vw-1">
                            {/* <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                                <i className="ri-map-pin-line text-xl d-hdpi-2:text-vw-xl"></i>
                            </span> */}
                            <span className="max-w-28 truncate d-hdpi-2:max-w-vw-28">
                                {destinations?.length > 0 ? (
                                    destinations.join(', ')
                                ) : (
                                    <span className="w-20 d-hdpi-2:w-vw-20 bg-gray-300 rounded-full h-2 d-hdpi-2:h-vw-2" />
                                )}
                            </span>
                        </div>
                        <div className="flex items-center mr-8 py-1 whitespace-nowrap d-hdpi-2:mr-vw-8 d-hdpi-2:py-vw-1">
                            {/* <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                                <i className="ri-time-line text-xl d-hdpi-2:text-vw-xl"></i>
                            </span> */}
                            {ContentDays}
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="mt-5">
                    <PillType key={myKey} type={type} />
                        </div>
                    {/* <div
                        className={classNames(
                            type.toLowerCase() === 'digital'
                                ? 'bg-gray-900 text-kn-primary'
                                : 'bg-green-200 text-green-900 font-semibold',
                            'uppercase rounded-full h-8 flex justify-center items-center  text-xxs  tracking-widest px-6'
                        )}>
                        {type}
                    </div> */}
                    </div>
                    {purchasedView && type.toLowerCase() === 'guided' && (
                        <div className="mt-4 d-hdpi-2:mt-vw-4">
                            <div className="flex flex-wrap items-center gap-2 d-hdpi-2:gap-1">
                                <span className="text-xs bg-green-100 text-green-600 whitespace-nowrap rounded-full px-2 py-0.5 d-hdpi-2:text-vw-xs d-hdpi-2:px-vw-2 d-hdpi-2:py-vw-0.5">
                                    {`Booked Date:  ${moment(travelDate).format(
                                        'MMM Do YYYY'
                                    )}`}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-600 whitespace-nowrap rounded-full px-2 py-0.5 d-hdpi-2:text-vw-xs d-hdpi-2:px-vw-2 d-hdpi-2:py-vw-0.5">
                                    Booking for: {people} people
                                </span>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({ globalState: state.globalState });

export default connect(mapStateToProps)(ResultCard);
