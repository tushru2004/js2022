require('dotenv').config()
const express = require('express');
const querystring = require('querystring');
const { URLSearchParams } = require('url');
const app = express()
const randomstring = require("randomstring");
const axios = require('axois');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const stateKey = 'spotify_auth_state';

app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = 8888;
app.listen(port, () => {
    console.log(`Express app is listening at http://localhost:${port}`);
});

app.get('/login', (req, res) => { 
    const state = randomstring.generate({
        length: 16,
        charset: 'alphabetic'
    });
    res.cookie(stateKey, state);
    const scope = 'user-read-private user-read-email';
    const queryParams = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams.toString()}`);
});

app.get('/callback', (req, res) => {
    res.send('callback');
});