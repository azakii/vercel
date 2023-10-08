import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Buttons__GroupNextPrev } from '@/blocks/Button/Buttons';
import Row from '../sections/Row';
import { randomItem, randomNumber } from '@/helpers/FEutils';
import classNames from 'classnames';

const CarouselCards = ({
    children,
    scrollSlides = 1,
    loop = false,
    useRow,
    randomStart,
    absoluteButtons,
    forceButtons
}) => {
    const [viewportRef, embla] = useEmblaCarousel({
        slidesToScroll: scrollSlides,
        skipSnaps: false,
        loop: loop
    });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
    const onSelect = useCallback(() => {
        if (!embla) return;
        setPrevBtnEnabled(embla.canScrollPrev());
        setNextBtnEnabled(embla.canScrollNext());
    }, [embla]);

    useEffect(() => {
        if (!embla) return;
        embla.on('select', onSelect);
        onSelect();
    }, [embla, onSelect]);

    useEffect(() => {
        if (embla && randomStart)
            embla.scrollTo(randomNumber(0, (children?.length ?? 1) - 1), true);
    }, [embla]);

    return (
        <div className="relative">
            <Row
                mainClasses={useRow ? undefined : ''}
                classes={classNames(
                    absoluteButtons && 'md:absolute md:-top-16 md:right-0'
                )}>
                <div
                    className={
                        useRow
                            ? 'mb-4 md:px-4 d-hdpi-2:mb-vw-4 d-hdpi-2:px-vw-4'
                            : 'mb-4 d-hdpi-2:mb-vw-4'
                    }>
                    <Buttons__GroupNextPrev
                        nextEnabled={nextBtnEnabled}
                        nextAction={scrollNext}
                        prevEnabled={prevBtnEnabled}
                        prevAction={scrollPrev}
                        // isPrev={!prevBtnState}
                        className={`z-30 touch:hidden2`}
                        forceButtons={forceButtons}
                        // rtl={rtl}
                    />
                </div>
            </Row>

            <div className="embla">
                <div className="embla__viewport" ref={viewportRef}>
                    <div className="embla__container">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default CarouselCards;
