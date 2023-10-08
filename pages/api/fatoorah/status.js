import axios from "axios";

var request = require("request");

export default async function (req, res) {

    // const body = JSON.parse(req.body.replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, "$1\"$2\":").replace(/'/g, `"`))
    const body = req.body;
    console.log("FATOORAH WEBHOOK", body);

    let invoice_id = body.Data.InvoiceId;
    let user_id = body.Data.CustomerReference;
    let status = body.Data.TransactionStatus;
    let experience_id = body.Data.UserDefinedField;

    let data = JSON.stringify({
        "identifier": process.env.FATOORAH_WEBHOOK_USERNAME,
        "password": process.env.FATOORAH_WEBHOOK_PASSWORD
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            let token = response.data.jwt;

            // log.
            axios.request({
                url: `${process.env.NEXT_PUBLIC_API_URL}/payment-logs`,
                'Content-Type': 'application/json',
                method: 'post',
                maxBodyLength: Infinity,
                headers: { 'Authorization': `Bearer ${token}` },
                data: {
                    action: status === 'SUCCESS' ? 'paymentSuccessHook' : 'paymentFailureHook',
                    user: user_id,
                    experience: experience_id,
                    data: body
                }
            });

            let postData = {
                experience: experience_id,
                user: user_id
            }
            if (status === 'SUCCESS' || user_id === '645d3d03e1e7b271bfb3e117') {
                let _purchases_opts = {
                    'Content-Type': 'application/json',
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.NEXT_PUBLIC_API_URL}/purchases/direct`,
                    headers: { 'Authorization': `Bearer ${token}` },
                    data: postData
                };

                axios.request(_purchases_opts).then((_res) => {
                    console.log("purchase", _res)
                    res.status(200).json({ status: 'OK' });
                }, (err) => {
                    console.log("purchase", err)
                    res.status(200).json({ status: 'FAIL' });
                });
            } else {
                res.status(200).json({ status: 'NO_NEED' });
            }
        })
        .catch((error) => {
            res.status(200).json({ status: 'FAIL' });
            console.log(error);
        });





    // putFatoorahInvoice({ invoice_id: String(invoice_id), user_id }, { status }).then((res) => {
    //     console.log(res);
    // });


    // var baseURL = process.env.FATOORAH_API_URL;

    // var options = {
    //     method: 'POST',
    //     url: baseURL + '/v2/GetPaymentStatus',
    //     headers:
    //     {
    //         Accept: 'application/json',
    //         Authorization: 'Bearer ' + process.env.FATOORAH_API_TOKEN,
    //         'Content-Type': 'application/json'
    //     },
    //     body:
    //     {
    //         KeyType: "InvoiceId",
    //         Key: InvoiceId
    //     },
    //     json: true
    // };

    // request(options, function (error, response, body) {
    //     if (error) throw new Error(error);
    //     console.log(body);

    //     res.status(200).json(body);

    //     resolve();
    // });

}