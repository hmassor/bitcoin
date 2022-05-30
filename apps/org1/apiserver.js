'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const path = require('path');
const TradeFunction = require('../tradefuncs.js');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');

const mspOrg = 'Org1MSP';
const orgUserId = 'appUserOrg1';				// in some functions this is referenced as "appUserID" not "orgUserId"

const firstChannelName = 'tradechannel1';
const firstChaincodeName = 'tradeCC1';
const secondChannelName = 'tradechannel2';
const secondChaincodeName = 'tradeCC2';

const caHostName = 'ca.org1.vegi.com';
const walletPath = path.join(__dirname, 'wallet');
const affiliation = 'org1.department1';
const peerOrganization = 'org1.vegi.com';
const connectionJSON = 'connection-org1.json';
const getAuthAndContract = new GetAuthAndContract();

app.post('/api/tradecontract/changeOwnerAddress', async function(req, res){
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        console.log(req.body.newOwnerStreet, req.body.newOwnerCity, req.body.newOwnerZIP, req.body.newOwnerCountry);
        await tradeFunc1.changeOwnerAddress(mspOrg, orgUserId, req.body.newOwnerStreet, req.body.newOwnerCity, req.body.newOwnerZIP, req.body.newOwnerCountry);
        res.send('Transaction has been submitted \n');
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/createOwner/', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.createOwner(mspOrg, orgUserId, req.body.ownerSurname, req.body.ownerStreet, req.body.ownerCity, req.body.ownerZIP, req.body.ownerCountry);
        res.send('Transaction has been submitted \n');
    } catch (error) {
           	console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/whatIsOnStock/:sellerAppUserID', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.whatIsOnStock(req.params.sellerAppUserID);
        console.log(result.toString());
        res.send(result);
        return result;
    } catch (error) {
             console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/buyStock/', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.buyStock(req.body.boxID, req.body.currentOwnerID, req.body.newOwnerID,  req.body.numberOfBoxesTraded);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showOwner/:appUserID', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.showOwner(req.params.appUserID);
        res.send(JSON.stringify(result));
        return result;
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showStockHistory/:boxID', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.showStockHistory(req.params.boxID, orgUserId);
        res.send(result);
        return result;
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showTradeTicket/:tradeticketID', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.showTradeTicket(req.params.tradeticketID);
        console.log(req.params.tradeticketID);
        res.send(JSON.stringify(result));
        return result;
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showVegi/:vegiID', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, firstChannelName, firstChaincodeName);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.showVegi(req.params.vegiID);
        res.send(JSON.stringify(result));
        return result;
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/logisticcontract/getCurrentLocation/:id', async function(req, res) {
    try {
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const logisticcontract1 = await getAuthAndContract.getContract(orgUserId, logisticChannelName, logisticChaincodeName);

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

app.listen(4201);