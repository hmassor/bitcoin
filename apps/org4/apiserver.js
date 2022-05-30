'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const path = require('path');
const TradeFunction = require('../tradefuncs.js');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');

const mspOrg = 'Org4MSP';
const orgUserId = 'appUserOrg4';				// in some functions this is referenced as "appUserID" not "orgUserId"

const firstChannelName = 'tradechannel1';
const firstChaincodeName = 'tradeCC1';
const secondChannelName = 'tradechannel2';
const secondChaincodeName = 'tradeCC2';

const caHostName = 'ca.org4.vegi.com';
const walletPath = path.join(__dirname, 'wallet');
const affiliation = 'org4.department1';
const peerOrganization = 'org4.vegi.com';
const connectionJSON = 'connection-org4.json';
const getAuthAndContract = new GetAuthAndContract();

app.post('/api/tradecontract/createVegi/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.createVegi(req.body.vegiID, req.body.vegiType, req.body.kilosPerBox);
        res.send('Transaction has been submitted \n');
    } catch (error) {
      		console.error(`******** FAILED to run the application: ${error}`);
    } finally {
    	await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/createGrower/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.createGrower(req.body.growerID, req.body.growerSurname, req.body.growerStreet, req.body.growerCity, req.body.growerZIP, req.body.growerCountry);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/changeOwnerAddress', async function(req, res){
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

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
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.createOwner(mspOrg, req.body.appUserID, req.body.ownerSurname, req.body.ownerStreet, req.body.ownerCity, req.body.ownerZIP, req.body.ownerCountry);
        res.send('Transaction has been submitted \n');
    } catch (error) {
           	console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/createStock/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        console.log(req.body.growerID, req.body.boxID, req.body.vegiID, req.body.pricePerKilo, req.body.harvestDate, req.body.numberOfBoxes, req.body.previousOwnerID, req.body.newOwnerID, req.body.stockExistsFlag);
        await tradeFunc1.createStock(req.body.growerID, req.body.boxID, req.body.vegiID, req.body.pricePerKilo, req.body.harvestDate, req.body.numberOfBoxes, req.body.previousOwnerID, req.body.newOwnerID, req.body.stockExistsFlag);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/whatIsOnStock/:sellerAppUserID', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

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

app.post('/api/tradecontract/changeStockQuantity/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.changeStockQuantity(req.body.boxID, req.body.appUserID, req.body.newNumberOfBoxes);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/changeStockPrice/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.changeStockPrice(req.body.boxID, req.body.appUserID, req.body.newStockPricePerKilo);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.post('/api/tradecontract/buyStock/', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        await tradeFunc1.buyStock(req.body.boxID, req.body.currentOwnerID, req.body.newOwnerID,  req.body.numberOfBoxesTraded);
        res.send('Transaction has been submitted \n');
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showGrower/:growerID', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.showGrower(req.params.growerID);
        res.send(JSON.stringify(result));
        return result;
    } catch (error) {
             console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showGrowerZIP/:growerZIP', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

        const tradeFunc1 = new TradeFunction(tradeContract1);
        let result = await tradeFunc1.showGrowerZIP(req.params.growerZIP);
        console.log(result.toString());
        res.send(result);
        return result;
    } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
    } finally {
        await getAuthAndContract.disconnectGateway();
    }
})

app.get('/api/tradecontract/showOwner/:appUserID', async function(req, res) {
    try {
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

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
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

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
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

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
        let channel = req.query.channel;
        let chaincode;
        if (channel == "tradechannel1") {
             chaincode = "tradeCC1";
        }else {
             chaincode = "tradeCC2";
        }
        await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation)
        const tradeContract1 = await getAuthAndContract.getContract(orgUserId, channel, chaincode);

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

app.listen(4200);