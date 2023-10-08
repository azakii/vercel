import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ResultCard from '@/blocks/Card/ResultCard';
import ResultCardMissing from '@/blocks/Card/ResultCardMissing';
import SectionTitle from '@/blocks/Title/SectionTitle';
import ButtonLoad from '@/blocks/Button/ButtonLoad';
import ResultCardSkeleton from '@/blocks/Card/ResultCardSkeleton';
import Row from './Row';
import { shuffleArray } from '@/helpers/FEutils';

import { connect } from 'react-redux';


import translations from '@/constants/translations';


const skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GridList = ({
    randomize,
    sectionTitles,
    data = [],
    btnLabel = 'Load More',
    btnAction = 'url',
    btnUrl,
    btnPos,
    loadMoreData,
    dataLoading = false,
    showButton = true,
    handleLoadClick,
    purchasedView = false,
    missing = false,
    margins,
    titleClass = 'mb-8 d-hdpi-2:mb-vw-8',
    titleColor,
    filteredCount,
    globalState: {
        lang },
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // let sortedData;
    // if (randomize === 'true') sortedData = shuffleArray(data);
    // else sortedData = data;

    const handleLoad = () => {
        //setIsLoading(!isLoading);
        handleLoadClick();
    };
    const handleClick = (e) => {
        e.preventDefault();
        router.push(btnUrl);
    };

    return (
        <>
            <div
                className={`bg-transparent mx-auto px-5 md:px-9 lg:px-12 xl:px-24 2xl:px-40 d-hdpi-2:px-vw-40 ${margins
                    ? margins
                    : sectionTitles
                        ? 'pt-24 mb-12 d-hdpi-2:mt-vw-24 d-hdpi-2:mb-vw-12'
                        : 'pb-12 d-hdpi-2:mb-vw-12'
                    }`}>
                <div className="flex justify-between">
                    {sectionTitles && (
                        <SectionTitle
                            section={sectionTitles}
                            className={titleClass}
                            titleColor={titleColor}
                        />
                    )}
                    {/* {btnPos && btnAction === 'url' && !purchasedView && (
                        <div className="hidden md:block pr-4 d-hdpi-2:pr-vw-4">
                            <ButtonLoad
                                width="w-40 d-hdpi-2:w-vw-40"
                                handleClick={handleClick}
                                isLoading={loadMoreData}
                                label={'Explore more'}
                                margins=""
                            />
                        </div>
                    )} */}
                </div>
                {!dataLoading ? (
                    <>
                        <div className="grid grid-cols-1 px-2 lg-px-0 gap-y-0 md:gap-y-0 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 xs:grid-cols-1">
                            {data
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
                        </div>

                        {btnPos && btnAction === 'url' && !purchasedView && (
                            <div className="block md:hidden2">
                                <ButtonLoad
                                    width="w-40 md:w-72"
                                    handleClick={handleClick}
                                    isLoading={loadMoreData}
                                    label={translations[lang].exploreMore}
                                />
                            </div>
                        )}

                        {!btnPos && btnAction === 'url' && !purchasedView && (
                            <ButtonLoad
                                handleClick={handleClick}
                                isLoading={loadMoreData}
                                label={btnLabel}
                            />
                        )}
                        {!btnPos &&
                            btnAction === 'load' &&
                            showButton &&
                            data.length > 0 &&
                            !purchasedView && (
                                <ButtonLoad
                                    handleClick={handleLoad}
                                    isLoading={loadMoreData}
                                    label={btnLabel}
                                />
                            )}
                    </>
                ) : (
                    <>
                        <div className="flex flex-wrap -mx-1a lg:-mx-4a">
                            {skeletonArray.map((item, index) => {
                                return (
                                    <ResultCardSkeleton key={`sk_${index}`} />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({ globalState: state.globalState });

export default connect(mapStateToProps)(GridList);
