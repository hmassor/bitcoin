'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const path = require('path');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');

const firstChannelName = 'logisticchannel1';
const firstChaincodeName = 'logisticCC1';
const secondChannelName = 'logisticchannel2';
const secondChaincodeName = 'logisticCC2';

const caHostName = 'ca.org3.vegi.com';
const walletPath = path.join(__dirname, 'wallet');
const mspOrg = 'Org3MSP';
const affiliation = 'org3.department1';
const orgUserId = 'appUserOrg3';				// in some functions this is referenced as "appUserID" not "orgUserId"
const peerOrganization = 'org3.vegi.com';
const connectionJSON = 'connection-org3.json';
const getAuthAndContract = new GetAuthAndContract();

app.get('/api/logisticcontract/queryCargoByTradeTicketID/:id', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.queryCargoByTradeTicketID(req.params.id);
        console.log(result.toString());
        res.send(result);
        return result;
    } catch (error) {
             console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/logisticcontract/processCargo/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.processCargo(req.body.tradeTicketID, req.body.cargoID, req.body.requestWasAccepted, req.body.cargoPricePerKilo, req.body.promisedDeliveryTimeInDays);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/logisticcontract/pickUpCargo/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.pickUpCargo(req.body.tradeTicketID, req.body.cargoID, req.body.checkInConsignerName, req.body.geoLongitude, req.body.geoLatitude);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/logisticcontract/changeCurrentLocation/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.changeCurrentLocation(req.body.tradeTicketID, req.body.cargoID, req.body.geoLongitude, req.body.geoLatitude);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/logisticcontract/getCurrentLocation/:id', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.getCurrentLocation(req.params.id);
        console.log(result.toString());
        res.send(result);
        return result;
    } catch (error) {
             console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/logisticcontract/deliverCargo/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.deliverCargo(req.body.tradeTicketID, req.body.cargoID, req.body.deliveryRecipientName, req.body.geoLongitude, req.body.geoLatitude);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/logisticcontract/queryCargoHistory/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "logisticchannel1") {
             chaincode = "logisticCC1";
        }else {
             chaincode = "logisticCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const logisticFunc1 = new LogisticFunction(logisticcontract1);
        let result = await logisticFunc1.queryCargoHistory(req.body.tradeTicketID, req.body.cargoID);
        res.send(result);
        return result;
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.listen(4202);