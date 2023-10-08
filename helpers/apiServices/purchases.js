import axios from 'axios';
import * as types from '@/store/actions/types';
import { serverErrors } from '@/helpers/serverErrors';
import {POST_PURCHASE_BYPASS} from '../../store/actions/types';


export const fetchPurchasedAll = (start=0, limit=1000, paginationBy=null) => {
    const purchaseCount = '';
    if(paginationBy) {
        // purchaseCount (where: { user: "60e1ff132fe7042f353d1b28"})
    }
    return (dispatch) =>
        dispatch({
            type: types.GET_PURCHASES,
            payload: axios.post(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
                query: `
                    query{
                        purchasesByUser (where: { start: ${start}, limit: ${limit} }) {
                            id
                            experience_id
                            people
                            travel_date
                            title
                            type
                            swellbypass
                            experience {
                            title
                            experience_id
                            featured_image
                            type
                            createdAt,
                            days,
                            user {
                                    _id
                                    id
                                    username
                                    role {
                                        id
                                    }
                                    profile {
                                        avatar
                                        country
                                        currency
                                        displayname
                                        first
                                        id
                                        last
                                    }
                                },
                            places_lists{
                                name
                                code
                            },
                            # content
                            },
                            
                        },
                        ${purchaseCount}
                }`
            })
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}

export const fetchPurchasedIds = () => {
    const gql = String.raw;

    return (dispatch) =>
        dispatch({
            type: types.GET_PURCHASE_IDS,
            payload: axios.post(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
                query: gql`
                    query{
                        purchasesByUser {
                            id
                            experience_id
                            }
                }`
            })
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}

export const postPurchase = (postData) => {
    return (dispatch) =>
        dispatch({
            type: types.POST_PURCHASE,
            payload: axios.post(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, postData)
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}
export const postFatoorahInvoice = (postData) => {
    return (dispatch) =>
        dispatch({
            type: types.POST_FATOORAH_INVOICE,
            payload: axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fatoorah-invoices`, postData)
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}
export const postPaymentLog = (postData) => {
    return (dispatch) =>
        dispatch({
            type: types.POST_FATOORAH_INVOICE,
            payload: axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment-logs`, postData)
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}
export const putFatoorahInvoice = (filterData, postData) => {
    return (dispatch) =>
        dispatch({
            type: types.POST_FATOORAH_INVOICE,
            payload: axios.put(`${process.env.NEXT_PUBLIC_API_URL}/fatoorah-invoices?filters[invoice_id][$eq]=${filterData.invoice_id}&filters[user][$eq]=${filterData.user_id}`, postData)
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}
export const postPurchaseBypass = (postData) => {
    return (dispatch) =>
        dispatch({
            type: types.POST_PURCHASE_BYPASS,
            payload: axios.post(`${process.env.NEXT_PUBLIC_API_URL}/purchasesBypass`, postData)
        })
        .then((res) => res)
        .catch((error) => {
            serverErrors(error);

            return { error };
        });
}

export function resetPurchase() {
    return (dispatch) => {
        dispatch({
            type: types.RESET_PURCHASES
        });
    };
}

export function setPurchaseIdsChangedFlag() {
    return (dispatch) => {
        dispatch({
            type: types.SET_PURCHASEDIDS_FLAG
        });
    };
}