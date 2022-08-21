require('dotenv').config()
const express = require('express');
const querystring = require('querystring');
const { URLSearchParams } = require('url');
const app = express()
const randomstring = require("randomstring");
const axios = require('axois');
const { urlencoded } = require('express');
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
    const code = req.query.code || null;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        }
    })
        .then(response => {
            if (response.status === 200) {
                res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
            } else {
                res.send(response);
            }
        })
        .catch(error => {
            res.send(error);
        });
});