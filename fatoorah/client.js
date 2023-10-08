var request = require("request");

export const initSession = async (CustomerIdentifier) => {
    const resp = await fetch("/api/fatoorah/initSession", {
        method: "POST",
        body: JSON.stringify({ CustomerIdentifier }),
    });

    const _resp = await resp.json();

    return { SessionID: _resp.Data.SessionId, CountryCode: _resp.Data.CountryCode };
}

export const sendPayment = async (CustomerRef, CustomerName, CustomerEmail, ExperienceID, price, ItemName) => {
    const _resp = await fetch("/api/fatoorah/sendPayment", {
        method: "POST",
        body: JSON.stringify({ CustomerRef, CustomerName, CustomerEmail, ExperienceID, price, ItemName }),
    });
    const resp = await _resp.json();
    return resp.Data.InvoiceURL;
}

export const executePayment = async (CustomerRef, CustomerName, CustomerEmail, ExperienceID, price, ItemName, SessionId) => {
    const _resp = await fetch("/api/fatoorah/executePayment", {
        method: "POST",
        body: JSON.stringify({ SessionId, CustomerRef, CustomerName, CustomerEmail, ExperienceID, price, ItemName }),
    });
    const resp = await _resp.json();
    console.log("executePayment");
    console.log(resp);
    return resp;
}
export const checkPaymentStatus = async (InvoiceId) => {
    const _resp = await fetch("/api/fatoorah/checkPayment", {
        method: "POST",
        body: JSON.stringify({ InvoiceId }),
    });
    const resp = await _resp.json();
    return resp;
}

export const callPaymentURL = async (paymentURL) => {
    await fetch("/api/fatoorah/paymentURL", {
        method: "POST",
        body: JSON.stringify({ paymentURL }),
    });
}