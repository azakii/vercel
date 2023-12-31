import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

const presets = {
    portrait: {
        size: 'object-cover w-full h-40 xs360:h-44 xs390:h-52 xs410:h-56 sm:h-64 md:h-64 lg:h-64 xl:h-72 2xl:h-96  d-hdpi-2:h-vw-96',
        text: 'text-lg  d-hdpi-2:text-vw-lg'
    },
    portrait2: {
        size: 'object-cover w-full h-40 xs360:h-44 xs390:h-52 xs410:h-56 sm:h-64 md:h-52 lg:h-64 xl:h-48 2xl:h-64  d-hdpi-2:h-vw-64',
        text: 'text-lg  d-hdpi-2:text-vw-lg'
    },

    landscape: {
        size: 'object-cover w-full h-24 lg:h-28  d-hdpi-2:h-vw-28',
        text: 'text-base  d-hdpi-2:text-vw-base'
    }
};

const TagCard = ({
    overrideData,
    data,
    linkName = 'name',
    containerClass,
    path = '/experiences/destination/',
    padding = 'pb-16 px-2 lg:px-2  d-hdpi-2:pb-vw-16  d-hdpi-2:px-vw-2',
    margins = 'my-3 lg:my-4  d-hdpi-2:my-vw-4',
    preset = 'portrait'
}) => {
    return (
        <div className={classNames(containerClass, margins, padding)}>
            <div className="overflow-hidden rounded-xl  d-hdpi-2:rounded-vw-xl  group relative border-transparent hover:border-green ring-2 ring-transparent hover:ring-green-400 hover:shadow-2xl-green-600 ring-offset-2 transition-all duration-300 ease-in-out ">
                <Link
                    href={
                        overrideData
                            ? `${path}${overrideData?.linkName}/all`
                            : `${path}${data?.[linkName]}/all`
                    }
                    legacyBehavior>
                    <div>
                        {overrideData?.image || data?.image ? (
                            <img
                                alt="Placeholder"
                                className={presets[preset].size}
                                data-blink-src={
                                    overrideData?.image ?? data?.image
                                }
                            />
                        ) : (
                            <div
                                className={classNames(
                                    presets[preset].size,
                                    'bg-gray-900'
                                )}></div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-green-800 to-transparent mix-blend-multiply text-white"></div>
                        <div
                            className={classNames(
                                'uppercase tracking-wide leading-none absolute left-4  d-hdpi-2:left-vw-4 right-16  d-hdpi-2:right-vw-16 bottom-4  d-hdpi-2:bottom-vw-4 text-white',
                                presets[preset].text
                            )}>
                            {overrideData ? overrideData.name : data.name}
                        </div>
                        {/* <div className='absolute z-50 inset-0 rounded-xl border-2 border-transparent hover:border-green-400 ring-4 ring-transparent hover:ring-green-200  transition-all duration-200 ease-in-out'></div> */}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default TagCard;

//
