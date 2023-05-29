'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const OAuth2Data = require('./auth/oauth2.keys.json');

const app = express();
app.use(express.json());
app.use(cors());

let eventHandler = require('./event-handler.js');
let network = require('./fabric/network.js');

const oAuth2Client = new google.auth.OAuth2(OAuth2Data.web.client_id,
    OAuth2Data.web.client_secret,
    OAuth2Data.web.redirect_uris[0]);

app.get('/rest/participants', async (req, res) => {

    const validToken = await network.validateToken(req,oAuth2Client,OAuth2Data);

    if(!validToken) {
        res.status(401).json({ message: 'invalid token'} );
        return;
    }
    let adminUser = await network.getAdminUser();

    let networkObj = await network.connectToNetwork(adminUser);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
    }

    console.log(req.body.id);
    let invokeResponse = await network.getParticipant(networkObj, req.body.id);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(invokeResponse);
    }
})

/**
 * Register a participant
 *
 * {"id":"participant-id","name":"name-participant","role":"name-of-the-role(like datascientist)>"}
 */
app.post('/rest/participants', async (req, res) => {

    const validToken = await network.validateToken(req,oAuth2Client,OAuth2Data);

    if(!validToken) {
        res.status(401).json({ message: 'invalid token'} );
        return;
    }

    // creating the identity for the user and add it to the wallet
    let response = await network.registerUser(req.body.id, req.body.name, req.body.role);

    if (response.error) {
        res.status(400).json({ message: response.error });
    } else {
        let adminUser = await network.getAdminUser();

        let networkObj = await network.connectToNetwork(adminUser);

        if (networkObj.error) {
            res.status(400).json({ message: networkObj.error });
        }

        let invokeResponse = await network.createParticipant(networkObj, req.body.id, req.body.name, req.body.role);

        if (invokeResponse.error) {
            res.status(400).json({ message: invokeResponse.error });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send(invokeResponse);
        }
    }
});

app.post('/rest/participants/auth', async (req, res) => {

    const validToken = await network.validateToken(req,oAuth2Client,OAuth2Data);

    if(!validToken) {
        res.status(401).json({ message: 'invalid token'} );
        return;
    }

    let networkObj = await network.connectToNetwork(req.body.id);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
        return;
    }

    let invokeResponse = await network.getParticipant(networkObj, req.body.id);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(invokeResponse);
    }
});

app.get('/rest/issuer/auth-url', async (req,res) => {

    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.email'
    });

    const result = {
        url: url
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(result));

});

app.post('/rest/issuer/validate-code', async (req,res) => {

    oAuth2Client.getToken(req.body.code, function (err, tokens) {

        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'invalid token - ' + err});
        } else {

            const tokenInfo = oAuth2Client.getTokenInfo(tokens.access_token).then(
                (value) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send({ 'email' : value.email, 'id-token': tokens.id_token });
                });
        }
    });

});

app.get('/test', async (req, res) => {
    return res.status(200).send('test');
})

const port = process.env.PORT || 8080;
app.listen(port);

eventHandler.createWebSocketServer();
eventHandler.registerListener(network);