/* eslint-disable no-console */
const crypto = require('crypto');
const {metrohash64} = require('metrohash');
const {createInterface} = require('readline');

function getSha(string) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(string))
        .digest('hex');
}

function getMetro(string) {
    return metrohash64(Buffer.from(string, 'utf8'), 0xcafebabe);
}

module.exports = {
    getMetro,
    getSha,
};

// For this demo app
// Admins can create users by CLI and inserting directly on DB

if (!module.parent) {
    const prompt = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    prompt.question('user: ', user => {
        prompt.question('password (will show on screen): ', password => {
            const sha = getSha(password);
            const metro = getMetro(password);

            logQuery({user, sha, metro});
            prompt.close();
        });
    });
}

function logQuery({user, sha, metro}) {
    console.log('\n\n Query to insert on RethinkDB:');
    console.log(`
r.db('sample-auth')
.table('test-users')
.insert({
  id: '${user}',
  passSha: '${sha}',
  passMetro: '${metro}',
});
`);
}
