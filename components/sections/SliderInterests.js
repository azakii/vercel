import TagCard from '@/blocks/Card/TagCard';
import SliderList from '@/blocks/SliderList';
import TagCardSkeleton from '@/blocks/Card/TagCardSkeleton';

const breakPoints = {
    default: { width: 320, slides: 2 },
    sm: { width: 640, slides: 2 },
    md: { width: 768, slides: 4 },
    lg: { width: 1024, slides: 5 },
    xl: { width: 1280, slides: 7 }
};

const skeletonArray = [1, 2, 3, 4, 5, 6];

const SliderInterests = ({
    path,
    sectionTitles,
    data,
    dataLoading = false,
    classes,
    margins = 'mt-20 mb-4 lg:mt-24 lg:mb-20',
    tagMargins = 'mt-3 lg:mt-4 ',
    tagPadding = 'px-2 lg:px-2 pb-12',
    tagRatio = 'portrait',
    world = true,
    absoluteButtons,
    forceButtons
}) => {
    return (
        <>
            <SliderList
                classes={classes}
                margins={margins}
                breakPoints={breakPoints}
                section={sectionTitles}
                dataLoading={dataLoading}
                absoluteButtons={absoluteButtons}
                forceButtons={forceButtons}>
                {world && (
                    <TagCard
                        path={path}
                        overrideData={{ linkName: 'all', name: 'All' }}
                        containerClass="embla__slide x2 md:x4 lg:x5 xl:x7"
                        type=""
                        padding={tagPadding}
                        margins={tagMargins}
                        preset={tagRatio}
                    />
                )}

                {!dataLoading ? (
                    data.map((item, index) => {
                        return (
                            <TagCard
                                path={path}
                                key={`int_${item.id}_${index}`}
                                data={item}
                                containerClass="embla__slide x2 md:x4 lg:x5 xl:x7"
                                // type=""
                                linkName="slug"
                                padding={tagPadding}
                                margins={tagMargins}
                                preset={tagRatio}
                            />
                        );
                    })
                ) : (
                    <div className="flex gap-4 mt-9">
                        {skeletonArray.map((item, index) => (
                            <TagCardSkeleton
                                key={`sk_${index}`}
                                containerClass="embla__slide x2 md:x4 lg:x5 xl:x7"
                            />
                        ))}
                    </div>
                )}
            </SliderList>
        </>
    );
};

export default SliderInterests;
