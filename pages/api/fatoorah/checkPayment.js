var request = require("request");

export default async function (req, res) {
    return new Promise((resolve, reject) => {

        const body = JSON.parse(req.body);
        console.log(body);

        const InvoiceId = body.InvoiceId;

        var baseURL = process.env.FATOORAH_API_URL;

        var options = {
            method: 'POST',
            url: baseURL + '/v2/GetPaymentStatus',
            headers:
            {
                Accept: 'application/json',
                Authorization: 'Bearer ' + process.env.FATOORAH_API_TOKEN,
                'Content-Type': 'application/json'
            },
            body:
            {
                KeyType: "InvoiceId",
                Key: InvoiceId
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);

            res.status(200).json(body);

            resolve();
        });

    });
}