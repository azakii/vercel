import React, { useEffect, useState } from 'react';

import Icons from '@/components/blocks/Icon/Icons';
import { handleRowReverse } from '@/helpers/FEutils';
import { useField } from 'formik';
import PopoverBlock from '@/components/forms/PopoverBlock';
import Cleave from 'cleave.js/react';
import { CardAmex, CardMastercard, CardVisa } from '@/components/svg/BankCards';

const cssError = {
    touchedError:
        'border-red-300 focus:ring-red-200 focus:border-red-400 hover:ring-red-200',
    noTouchedError:
        'border-transparent hover:ring-green-200 focus:ring-red-200 focus:border-red-400',
    noError:
        'focus:ring-green-200 focus:border-green-400 hover:ring-green-200 border-transparent'
};

const commonClasses = {
    zIndex: {
        active: 'z-100',
        inactive: ''
    },
    label: {
        active: '-translate-y-6 scale-75',
        inactive: '-translate-y-1/2 scale-100'
    }
};

// const validationIcons = {
//     visa: 'ri-visa-line',
//     mastercard: 'ri-mastercard-line',
//     amex: 'lab la-cc-amex',
//     default: 'ri-check-line'
// };

const validationIcons = {
    visa: <CardVisa />,
    mastercard: <CardMastercard />,
    amex: <CardAmex />,
    default: <i className="ri-check-line" />
};

const FatoorahForm = ({
    className = '',
    padding = 'py-3 px-4',
    height = 'h-32',
    width = 'w-full',
    text = 'text-sm',
    icon,
    type = 'text',
    error = false,
    rtl = false,
    label,
    radius,
    radiusActive,
    placeholder,
    name,
    filterMode,
    cardMode,
    options,
    ...props
}) => {
    const [field, meta, helpers] = useField({ name });
    const [hidden, setHidden] = useState(true);
    const [classError, setClassError] = useState();
    const [inputValue, setInputValue] = useState('');
    const [touched, setTouched] = useState(false);
    const [validIcon, setValidIcon] = useState(null);
    useEffect(() => {
        if (touched) {
            if (meta.error) setClassError(cssError.touchedError);
            if (!meta.error) setClassError(cssError.noError);
        } else {
            if (meta.error) setClassError(cssError.noTouchedError);
            if (!meta.error) setClassError(cssError.noError);
        }
        // console.log('meta field', meta);
    }, [meta, field.value]);

    const [classes, setClasses] = useState({
        label: commonClasses.label.inactive,
        zIndex: commonClasses.zIndex.inactive,
        placeholder: ''
    });

    const options2 = {
        ...options,
        onCreditCardTypeChanged: function (type) {
            setValidIcon(validationIcons[type]);
        }
    };

    const handleChange = (event) => {
        helpers.setValue(
            filterMode ? event.target.rawValue : event.target.value
        );
        // setInputValue(event.target.rawValue);
        // console.log('input value', inputValue);
    };

    const handleInputFocus = (event) => {
        setClasses({
            ...classes,

            label: commonClasses.label.active,
            zIndex: commonClasses.zIndex.active,
            placeholder
        });
        setTouched(true);
    };

    const handleInputBlur = (event) => {
        if (event.target.value) {
            setClasses({
                ...classes,

                label: commonClasses.label.active,
                zIndex: commonClasses.zIndex.inactive,
                placeholder
            });
        } else {
            setClasses({
                ...classes,

                label: commonClasses.label.inactive,
                zIndex: commonClasses.zIndex.inactive,
                placeholder: ''
            });
        }
    };

    const handleInputHover = (event) => {
        setClasses({
            ...classes,
            zIndex: commonClasses.zIndex.active
        });
    };

    const handleInputLeave = (event) => {
        setClasses({
            ...classes,
            zIndex: commonClasses.zIndex.inactive
        });
    };

    return (
        <>
            <h1>Card View Payment</h1>

            <script src="https://demo.myfatoorah.com/cardview/v2/session.js"></script>
            <div style="width:400px">
                <div id="card-element"></div>
            </div>
            <button onclick="submit()">Pay Now</button>
        </>
    );
};

export default FatoorahForm;
