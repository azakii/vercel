import Icons from '@/blocks/Icon/Icons';
import { handleRowReverse } from 'helpers/FEutils';
import KnIcons from 'constants/KnIcons';

const Pill__Container = ({ edit, rtl, children, className }) => {
    return (
        <div
            className={`${className || ''} z-10 border-2 border-transparent ${
                edit && 'hover:border-kn-primary  cursor-pointer'
            } transition-colors ease-in-out duration-500 rounded-3xl flex flex-col lg:${
                handleRowReverse(rtl).flex
            } items-center justify-center p-2 px-4 lg:p-2 -mt-14 lg:-mt-12 lg:bg-white lg:w-max mx-auto  lg:rounded-full lg:shadow-2xl-green-400 lg:mb-8`}>
            {children}
        </div>
    );
};

const Pill__Icon = ({ icon, size }) => {
    return (
        <div className="w-24 h-16 lg:w-24 lg:h-12 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-green-300 via-green-400 to-green-500 shadow-2xl-green-500">
            {/* icon with coloring and size*/}
            <Icons
                iName={icon}
                iClasses="text-transparent bg-clip-text  bg-gradient-to-tr from-gray-900 to-blue-400 mix-blend-multiply"
            />
        </div>
    );
};

const Pill__Logo = ({ noshadow, iconSize = 22, size = 'w-8 h-11' }) => {
    return (
        <div
            className={`${size} transform d-hdpi-2:scale-75 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-green-300 via-green-400 to-green-500 ${
                noshadow ? '' : 'shadow-2xl-green-500'
            }`}>
            <KnIcons
                icon="KnLogo2"
                size={iconSize}
                className="text-gray-600 mix-blend-multiply"
            />
        </div>
    );
};

const Pill__Title = ({ title }) => {
    return (
        <div className="leading-8 text-2xl d-hdpi-2:text-vw-2xl font-bold  lg:text-2xl pt-6 lg:py-0 lg:px-8 d-hdpi-2:px-vw-8 d-hdpi-2:py-0 bg-clip-text text-transparent bg-gradient-to-tr from-black to-green-400">
            {title}
        </div>
    );
};

const Pill__Experience = ({ label = 'Digital', classes = '' }) => {
    return (
        <div
            className={`uppercase rounded-full h-8 d-hdpi-2:h-vw-8 flex whitespace-nowrap justify-center items-center bg-gray-900 text-xxs d-hdpi-2:text-vw-xxs text-kn-primary tracking-widest px-6 d-hdpi-2:px-vw-6 ${classes}`}>
            {label}
        </div>
    );
};

export {
    Pill__Icon,
    Pill__Title,
    Pill__Container,
    Pill__Logo,
    Pill__Experience
};
