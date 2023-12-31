import ResultCard from '@/blocks/Card/ResultCard';
import SliderList from '@/blocks/SliderList';
import ResultCardSkeleton from '../blocks/Card/ResultCardSkeleton';

const breakPoints = {
    default: { width: 320, slides: 2 },
    sm: { width: 640, slides: 2 },
    md: { width: 768, slides: 3 },
    lg: { width: 1024, slides: 4 },
    xl: { width: 1280, slides: 5 }
};

const skeletonArray = [1, 2, 3, 4, 5];

const SliderExperiences = ({
    sectionTitles,
    latestList,
    dataLoading = false,
    absoluteButtons,
    forceButtons
}) => {
    return (
        <>
            <SliderList
                breakPoints={breakPoints}
                section={sectionTitles}
                dataLoading={dataLoading}
                absoluteButtons={absoluteButtons}
                forceButtons={forceButtons}>
                {!dataLoading ? (
                    latestList.map((item, index) => {
                        return (
                            <ResultCard
                                myKey={`exp_${item.content.experience_id}_${index}`}
                                data={item}
                                containerClass="embla__slide x2 md:x3 lg:x4 xl:x5"
                            />
                        );
                    })
                ) : (
                    <div className="flex gap-4 mt-9">
                        {skeletonArray.map((item, index) => (
                            <ResultCardSkeleton
                                myKey={`sk_${index}`}
                                containerClass="embla__slide x2 md:x3 lg:x4 xl:x5"
                            />
                        ))}
                    </div>
                )}
            </SliderList>
        </>
    );
};

export default SliderExperiences;
