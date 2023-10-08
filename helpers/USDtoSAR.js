import React, { useState, useEffect } from 'react';
import { currenciesObject } from '@/constants/currenciesObject';
import store from 'store/index';
import Router from 'next/router'


const defaultObj = {
    values: [0],
    currency: {
        code: 'USD',
        name: currenciesObject['USD'].name_plural
    },
    rate: 1
};

const USDtoSAR = (beforeXchangeArr) => {
    const from = 'USD';
    const to = 'SAR';

    // get xchange rates from store
    const {
        globalState: {
            siteData: {
                settings: { xchangeRates }
            }
        }
    } = store.getState();

    // xchange rate function

    const exchange = (values, fromCur, toCur, decPoint = 2) => {
        let exchanged = false;
        while (!exchanged) {
            if (typeof xchangeRates == 'undefined' || typeof xchangeRates.quotes == 'undefined') {
                // Router.reload(window.location.pathname)

                // window.history.back();
            }
            else
                exchanged = true;

            const fromRate =
                xchangeRates.quotes[`USD${fromCur === '000' ? 'USD' : fromCur}`] || 1;
            const toRate =
                xchangeRates.quotes[`USD${toCur === '000' ? 'USD' : toCur}`] || 1;

            if (exchanged)
                return values.map((value) => {
                    return ((value / fromRate) * toRate).toFixed(decPoint);
                });
        }
    };

    // useEffect

    return exchange(
        beforeXchangeArr,
        from,
        to,
        2)
};

export default USDtoSAR;
