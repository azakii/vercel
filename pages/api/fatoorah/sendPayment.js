var request = require("request");

export default function handler(req, res) {
    const body = JSON.parse(req.body);
    console.log(body);

    const customerRef = body.CustomerRef;
    const customerName = body.CustomerName; 
    const customerEmail = body.CustomerEmail;
    const experienceID = body.ExperienceID;
    const price = body.price;
    const title = body.ItemName;
    
    var baseURL = process.env.FATOORAH_API_URL;

    var options = {
        method: 'POST',
        url: baseURL + '/v2/SendPayment',
        headers:
        {
            Accept: 'application/json',
            Authorization: 'Bearer ' + process.env.FATOORAH_API_TOKEN,
            'Content-Type': 'application/json'
        },
        body:
        {
            NotificationOption: 'ALL',
            CustomerReference: customerRef,
            CustomerName: customerName,
            DisplayCurrencyIso: process.env.FATOORAH_CURRENCY,
            CustomerEmail: customerEmail,
            CustomerMobile: '',
            ExperienceID: experienceID,
            InvoiceValue: price,
            CallBackUrl: process.env.FATOORAH_CALLBACK_URL,
            ErrorUrl: process.env.FATOORAH_ERROR_URL,
            Language: process.env.FATOORAH_LANG,
            InvoiceItems: [{ ItemName: title, Quantity: 1, UnitPrice: price }]
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);

        // if (body.IsSuccess === true && typeof body.Data !== 'undefined' && typeof body.Data.InvoiceURL !== 'undefined') {
            res.status(200).json(body);
        // } else
            // res.status(503);
    });
}