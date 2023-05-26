'use strict';

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let eventHandler = require('./event-handler.js');
let network = require('./fabric/network.js');

app.get('/rest/participants', async (req, res) => {
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

app.post('/addNotaryLog', async (req, res) => {
    let networkObj = await network.connectToNetwork(req.body.participantId);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
    }

    let invokeResponse = await network.addNotaryLog(networkObj, req.body.participantId, req.body.type, req.body.logText);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(invokeResponse);
    }
});

app.get('/getNotaryLog', async (req, res) => {
    let networkObj = await network.connectToNetwork(req.query.participantId);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
    }

    let invokeResponse = await network.getNotaryLog(networkObj, req.body.id);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(invokeResponse);
    }
});

app.get('/getAllNotaryLogs', async (req, res) => {
    let networkObj = await network.connectToNetwork(req.query.participantId);

    if (networkObj.error) {
        res.status(400).json({ message: networkObj.error });
        return;
    }

    let invokeResponse = await network.getAllNotaryLogs(networkObj, req.params.participantId);

    if (invokeResponse.error) {
        res.status(400).json({ message: invokeResponse.error });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(invokeResponse);
    }
});

app.get('/test', async (req, res) => {
    return res.status(200).send('test');
})

const port = process.env.PORT || 8080;
app.listen(port);
