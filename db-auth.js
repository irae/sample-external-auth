const r = require('rethinkdb');
const {getMetro, getSha} = require('./login');
const sendError = require('./send-error');

const {DB_HOST, DB_PORT} = process.env;

const dbOptions = {
    host: DB_HOST || 'localhost',
    port: DB_PORT || 28015,
};

let connection = null;

setInterval(function dbConnectionTick() {
    if (!connection || !connection.open) {
        r.connect(dbOptions, function (error, newConnection) {
            if (error) return console.error(error.message || error);
            connection = newConnection;
        });
    }
}, 5 * 1000);

module.exports = (req, res, next) => {
    const {
        body: {username, password},
    } = req;
    if (!username || !password) {
        return sendError('Unauthorized', res);
    }

    const query = r.db('sample-auth').table('test-users').get(username);

    return query
        .run(connection)
        .then(user => {
            if (!user) return sendError('Unauthorized', res);

            const {passSha, passMetro} = user;
            const sha = getSha(password);
            const metro = getMetro(password);
            if (passSha !== sha || passMetro !== metro) {
                return sendError('Unauthorized', res);
            }
            next();
        })
        .catch(error => {
            console.error(error);
            sendError(error, res);
        });
};
