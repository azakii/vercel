import ImageCard from '@/blocks/Card/ImageCard';
import SliderList from '@/blocks/SliderList';
import ResultCardSkeleton from '../blocks/Card/ResultCardSkeleton';

const breakPoints = {
    default: { width: 320, slides: 2 },
    sm: { width: 640, slides: 2 },
    md: { width: 768, slides: 3 },
    lg: { width: 1024, slides: 3 },
    xl: { width: 1280, slides: 3 }
};

const skeletonArray = [1, 2, 3, 4, 5];

const SliderImages = ({ data, dataLoading, absoluteButtons, forceButtons }) => {
    return (
        <>
            <SliderList
                breakPoints={breakPoints}
                dataLoading={dataLoading}
                boxed={true}
                absoluteButtons={absoluteButtons}
                forceButtons={forceButtons}>
                {!dataLoading ? (
                    data.map((item, index) => {
                        return (
                            <ImageCard
                                key={`exp_${item.id}_${index}`}
                                imgObj={item}
                                containerClass="embla__slide x2 md:x3"
                            />
                        );
                    })
                ) : (
                    <div className="flex gap-4 mt-9">
                        {skeletonArray.map((item, index) => (
                            <ResultCardSkeleton
                                myKey={`sk_${index}`}
                                containerClass="embla__slide x2 md:x3"
                            />
                        ))}
                    </div>
                )}
            </SliderList>
        </>
    );
};

export default SliderImages;
