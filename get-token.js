const boardCname = process.env.SAMPLE_BOARD_AUTH_CNAME;
const apiKey = process.env.SAMPLE_BOARD_AUTH_DOMAIN;

const request = require('request-promise-native');

const sendError = require('./send-error');

module.exports = (req, res) => {
    const {
        query: {to: rawTo = ''},
    } = req;

    const to = rawTo.toString().indexOf('/') === 0 ? rawTo : '/';

    return request({
        url: ['https://', boardCname, '/api/auth-token'].join(''),
        json: true,
        method: 'POST',
        strictSSL: false,
        body: {apiKey},
    })
        .then(response => {
            if (process.NODE_ENV !== 'production') {
                console.log(response);
            }

            const {loginToken} = response;
            const query = {
                token: loginToken,
            };
            if (to !== '/') {
                query.to = to;
            }
            const params = new URLSearchParams(query);

            res.redirect(`https://${boardCname}/auth?${params.toString()}`);
        })
        .catch(error => {
            console.error(error);
            sendError(error.message || 'Unkown error', res);
        });
};
