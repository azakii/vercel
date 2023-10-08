import classNames from 'classnames';

const PillType = ({ type, label }) => {
    return (
        <div
            className={classNames(
                type.toLowerCase() === 'digital'
                    ? 'bg-green-400 text-green-500a text-gray-900'
                    : 'bg-green-400 shadow-2xl-green-500 font-semibold text-green-900 mix-blend-multiply',
                'uppercase rounded-full h-5 flex justify-center items-center text-xxs d-hdpi-2:text-vw-xxs px-2 whitespace-nowrap d-hdpi-2:h-vw-8 d-hdpi-2:px-vw-6'
            )}>
            {label || type}
        </div>
    );
};

export default PillType;
