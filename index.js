/* eslint-disable no-console */
const {PORT} = process.env;

const app = require('./app');

const hostname = require('os').hostname();
const httpServer = require('http').createServer(app);
const serverPort = PORT || 3000;

httpServer.listen(serverPort, function () {
    console.log('%s:%s : listening', hostname, serverPort);
});
