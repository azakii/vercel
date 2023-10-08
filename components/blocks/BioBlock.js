import classNames from 'classnames';
import { useEffect } from 'react';
import { useState } from 'react';

const BioBlock = ({
    absolute,
    mode = 'auto',
    max,
    bio,
    containerClass,
    buttonMargins = 'mt-4',
    className = 'block-html leading-6 text-xs md:text-sm'
}) => {
    const [isReadMore, setIsReadMore] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const regex = new RegExp(/\[read more]/gm);
    useEffect(() => {
        switch (mode) {
            case 'auto':
                setIsReadMore(regex.test(bio));
                break;

            case 'charCount':
                if (max) {
                    setIsReadMore(bio.length > max);
                } else setIsReadMore(false);
                break;
            default:
                break;
        }
    }, [bio]);

    const filterBio = (text, mode, max) => {
        switch (mode) {
            case 'auto':
                if (isReadMore) {
                    if (isOpen) return text.replace('[read more]', '');
                    else return text.split('[read more]')[0];
                } else return text;

            case 'charCount':
                if (max) {
                    if (isOpen) return text;
                    else return `${bio.slice(0, max)}...`;
                } else return text;

            default:
                return text;
        }
    };

    return (
        <div className={containerClass}>
            <div
                className={className}
                dangerouslySetInnerHTML={{
                    __html: filterBio(bio, mode, max)
                }}
            />
            {isReadMore && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames(
                        absolute && 'absolute z-500',
                        'focus:outline-none text-xs hover:bg-gray-900  hover:text-white bg-gray-200 text-gray-600 rounded-full px-4 py-1 ',
                        buttonMargins
                    )}>
                    {isOpen ? 'Read Less' : 'Read More'}
                </button>
            )}
        </div>
    );
};
export default BioBlock;
