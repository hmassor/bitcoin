'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../utils/CAUtil.js');
const { buildCCPOrg, buildWallet } = require('../utils/AppUtil.js');


class GetAuthAndContract{

    constructor() {
        this.ccp = 0;
        this.wallet = 0;
        this.gateway = new Gateway();
    }

    async enrollUser(peerOrganization, connectionJSON, caHostName, walletPath, mspOrg, orgUserId, affiliation) {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            this.ccp = await buildCCPOrg(peerOrganization, connectionJSON);

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = await buildCAClient(FabricCAServices, this.ccp, caHostName);

            // setup the wallet to hold the credentials of the application user
            this.wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, this.wallet, mspOrg);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, this.wallet, mspOrg, orgUserId, affiliation);

        } catch
            (error) {
            console.error(`******** FAILED to register, enroll or authenticate the user: ${error}`);
        }
    }

    async getContract(orgUserId, channelName, chaincodeName) {
        try {
            await this.gateway.connect(this.ccp, {
                wallet: this.wallet,
                identity: orgUserId,
                discovery: {enabled: true, asLocalhost: true} // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            const network = await this.gateway.getNetwork(channelName);
            return await network.getContract(chaincodeName);

        } catch
            (error) {
            console.error(`******** FAILED to get the contract: ${error}`);
        }
    }

    async disconnectGateway() {
        try {
            await this.gateway.disconnect();
        } catch
            (error) {console.error(`******** Gateway could not disconnect: ${error}`);
        }
    }

}

module.exports = GetAuthAndContract;