var request = require("request");

export default async function (req, res) {
    return new Promise((resolve, reject) => {

        const body = JSON.parse(req.body);

        const paymentURL = body.paymentURL;

        var options = {
            method: 'GET',
            url: paymentURL,
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);

            res.status(200).json(body);

            resolve();
        });

    });
}