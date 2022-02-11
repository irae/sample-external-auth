/* eslint-disable no-console */
const {join} = require('path');
const express = require('express');

const {Router, urlencoded} = express;

const app = express();
const router = Router();

app.use(require('morgan')('tiny'));

router.get('/login', (req, res) => {
    res.sendFile(join(__dirname, 'login.html'));
});
const dbAuth = require('./db-auth');
const getToken = require('./get-token');
router.post('/login', urlencoded({extended: false}), dbAuth, getToken);

app.use(router);
module.exports = app;
