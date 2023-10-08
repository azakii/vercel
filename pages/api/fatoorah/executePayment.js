var request = require("request");

export default async function (req, res) {
    return new Promise((resolve, reject) => {
        const body = JSON.parse(req.body);
        console.log(body);
    
        const CustomerReference = body.CustomerRef;
        const CustomerName = body.CustomerName; 
        const CustomerEmail = body.CustomerEmail;
        const ExperienceID = body.ExperienceID;
        const price = body.price;
        const title = body.ItemName;
        const SessionId = body.SessionId
        
        var baseURL = process.env.FATOORAH_API_URL;
    
        var options = {
            method: 'POST',
            url: baseURL + '/v2/executePayment',
            headers:
            {
                Accept: 'application/json',
                Authorization: 'Bearer ' + process.env.FATOORAH_API_TOKEN,
                'Content-Type': 'application/json'
            },
            body:
            {
                NotificationOption: 'ALL',
                CustomerReference,
                CustomerName,
                DisplayCurrencyIso: process.env.FATOORAH_CURRENCY,
                CustomerEmail,
                CustomerMobile: '',
                UserDefinedField: ExperienceID,
                InvoiceValue: price,
                CallBackUrl: process.env.FATOORAH_CALLBACK_URL,
                ErrorUrl: process.env.FATOORAH_ERROR_URL,
                Language: process.env.FATOORAH_LANG,
                InvoiceItems: [{ ItemName: title, Quantity: 1, UnitPrice: price }],
                SessionId
            },
            json: true
        };
    
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
    
            if (body.IsSuccess === true) {
                res.status(200).json(body);
            } else
                res.status(503).json(body);

            resolve();
        });
    });
    
}