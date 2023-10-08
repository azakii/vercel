var request = require("request");

export default async function (req, res) {
    return new Promise((resolve, reject) => {
        const body = JSON.parse(req.body);
        console.log(body);

        const CustomerIdentifier = body.CustomerIdentifier;

        var baseURL = process.env.FATOORAH_API_URL;

        var options = {
            method: 'POST',
            url: baseURL + '/v2/InitiateSession',
            headers:
            {
                Accept: 'application/json',
                Authorization: 'Bearer ' + process.env.FATOORAH_API_TOKEN,
                'Content-Type': 'application/json'
            },
            body:
            {
                CustomerIdentifier
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log("body", body);



            // if (body.IsSuccess === true && typeof body.Data !== 'undefined' && typeof body.Data.SessionId != 'undefined') {
            res.status(200).send(body);

            resolve();
            // } else
            //     res.status(503);
        });
    });

}