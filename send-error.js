const {join} = require('path');
const {readFileSync} = require('fs');

const contents = readFileSync(join(__dirname, 'login.html'), 'utf8');

module.exports = function sendError(error, res) {
    if (!res) throw 'missing res';
    return res
        .status(500)
        .send(contents.replace('<!--error-->', error.toString()));
};
