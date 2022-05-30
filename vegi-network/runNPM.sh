#!/bin/bash

source scriptUtils.sh

infoln "Running 'npm install' for all chaincodes and applications."
infoln "Running 'npm install' for trade chaincode:"
cd ${PWD}/../chaincode/trade || exit
npm install

infoln "Running 'npm install' for logistic chaincode:"
cd ../logistic || exit
npm install

infoln "Running 'npm install' for trade and logistic apps:"
cd ../../apps || exit
npm install


successln "Successfully ran 'npm install' for all chaincodes and applications."