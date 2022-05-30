'use strict';

const path = require('path');
const LogisticFunction = require('../logisticfuncs.js');
const GetAuthAndContract = require('../getauthandcontract.js');
const tradeChannelName = 'tradechannel2';
const tradeChaincodeName = 'tradeCC2';
const logisticChannelName = 'logisticchannel2';
const logisticChaincodeName = 'logisticCC2';


const caHostName = 'ca.org2.vegi.com';
const walletPath = path.join(__dirname, '../org2/wallet');
const mspOrg = 'Org2MSP';
const affiliation = 'org2.department1';
const orgUserId = 'appUserOrg2';				// in some functions this is referenced as "appUserID" not "orgUserId"
const peerOrganization = 'org2.vegi.com';
const connectionJSON = 'connection-org2.json';

async function listener() {

	const getAuthAndContract = new GetAuthAndContract();

	try {
		// Authenticate user of Org4
		await getAuthAndContract.enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation);

		// Get contract for tradechannel2 and tradeCC2
		const tradeContract = await getAuthAndContract.getContract(orgUserId, tradeChannelName, tradeChaincodeName);

		// Get contract for logisticchannel2 and logisticCC2
		const logisticContract = await getAuthAndContract.getContract(orgUserId, logisticChannelName, logisticChaincodeName);


		// Trade Listener for tradechannel2 and tradeCC2
		const tradeListener = async (event) => {
			if (event.eventName === 'buyStockEvent') {
				let eventData = JSON.parse(event.payload);
				console.log('-------------------------------------------------');
				console.log("> INCOMING EVENT for: " +  event.eventName);
				console.log('TradeTicketID: '+ eventData.tradeTicketID);
				console.log('Seller AppID: '+ eventData.sellerAppID);
				console.log('Seller Name: '+ eventData.sellerName);
				console.log('Seller Street: '+ eventData.sellerStreet);
				console.log('Seller ZIP: '+ eventData.sellerZIP);
				console.log('Seller City: '+ eventData.sellerCity);
				console.log('Seller Country: '+ eventData.sellerCountry);
				console.log('Buyer AppID: '+ eventData.buyerAppID);
				console.log('Buyer Name: '+ eventData.buyerName);
				console.log('Buyer Street: '+ eventData.buyerStreet);
				console.log('Buyer ZIP: '+ eventData.buyerZIP);
				console.log('Buyer City: '+ eventData.buyerCity);
				console.log('Buyer Country: '+ eventData.buyerCountry);
				console.log('Buyer Country: '+ eventData.boxID);
				console.log('NumberofBoxes: '+ eventData.numberOfBoxes);
				console.log('KilosPerBox: '+ eventData.kilosPerBox);
				console.log('-------------------------------------------------');
				////////////////////////////////////////////////////////
				// Here go the app-functions from logisticfuncs

				const logisticFunc = new LogisticFunction(logisticContract);
				await logisticFunc.requestCargo(eventData.sellerAppID, eventData.sellerName, eventData.sellerStreet,
					eventData.sellerZIP, eventData.sellerCity, eventData.sellerCountry,
					eventData.buyerAppID, eventData.buyerName, eventData.buyerStreet, eventData.buyerZIP, eventData.buyerCity,
					eventData.buyerCountry, eventData.tradeTicketID, eventData.boxID, eventData.numberOfBoxes, eventData.kilosPerBox);

				console.log('-------------------------------------------------');
				console.log('----- A requestCargo()-Request was sent !!! -----');
				console.log('-------------------------------------------------');
				////////////////////////////////////////////////////////
			}}
		await tradeContract.addContractListener(tradeListener);


	}
	catch (e){
		console.error(`******** FAILED to run tradeListener: ${e}`);
	}
}
listener();
