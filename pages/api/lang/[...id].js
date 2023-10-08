import { getCookies, getCookie, setCookies, removeCookies } from 'cookies-next';


export default async function handler (req, res) {
    const { id } = req.query;

    if(id == '0') {
        res.status(200).send(getCookie('lang'));
    }
    else {
        setCookies('lang', id);
        res.status(200).end();
    }
    
};