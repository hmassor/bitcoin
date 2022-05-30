#!/bin/bash

source scriptUtils.sh

function createOrg1() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/org1.vegi.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.vegi.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-org1 --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/org1.vegi.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name org1admin --id.secret org1adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/org1.vegi.com/peers
  mkdir -p organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/msp --csr.hosts peer0.org1.vegi.com --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls --enrollment.profile tls --csr.hosts peer0.org1.vegi.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/org1.vegi.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.vegi.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/org1.vegi.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.vegi.com/tlsca/tlsca.org1.vegi.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/org1.vegi.com/ca
  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/peers/peer0.org1.vegi.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/org1.vegi.com/ca/ca.org1.vegi.com-cert.pem

  mkdir -p organizations/peerOrganizations/org1.vegi.com/users
  mkdir -p organizations/peerOrganizations/org1.vegi.com/users/User1@org1.vegi.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.vegi.com/users/User1@org1.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.vegi.com/users/User1@org1.vegi.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/org1.vegi.com/users/Admin@org1.vegi.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org1admin:org1adminpw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.vegi.com/users/Admin@org1.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.vegi.com/users/Admin@org1.vegi.com/msp/config.yaml

}

function createOrg2() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/org2.vegi.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org2.vegi.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7154 --caname ca-org2 --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7154-ca-org2.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7154-ca-org2.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7154-ca-org2.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7154-ca-org2.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/org2.vegi.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name org2admin --id.secret org2adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/org2.vegi.com/peers
  mkdir -p organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7154 --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/msp --csr.hosts peer0.org2.vegi.com --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7154 --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls --enrollment.profile tls --csr.hosts peer0.org2.vegi.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/org2.vegi.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.vegi.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/org2.vegi.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.vegi.com/tlsca/tlsca.org2.vegi.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/org2.vegi.com/ca
  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/peers/peer0.org2.vegi.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/org2.vegi.com/ca/ca.org2.vegi.com-cert.pem

  mkdir -p organizations/peerOrganizations/org2.vegi.com/users
  mkdir -p organizations/peerOrganizations/org2.vegi.com/users/User1@org2.vegi.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7154 --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.vegi.com/users/User1@org2.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.vegi.com/users/User1@org2.vegi.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/org2.vegi.com/users/Admin@org2.vegi.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org2admin:org2adminpw@localhost:7154 --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.vegi.com/users/Admin@org2.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.vegi.com/users/Admin@org2.vegi.com/msp/config.yaml

}

function createOrg3() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/org3.vegi.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org3.vegi.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7254 --caname ca-org3 --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7254-ca-org3.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7254-ca-org3.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7254-ca-org3.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7254-ca-org3.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/org3.vegi.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name org3admin --id.secret org3adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  mkdir -p organizations/peerOrganizations/org3.vegi.com/peers
  mkdir -p organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7254 --caname ca-org3 -M ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/msp --csr.hosts peer0.org3.vegi.com --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7254 --caname ca-org3 -M ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls --enrollment.profile tls --csr.hosts peer0.org3.vegi.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/org3.vegi.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org3.vegi.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/org3.vegi.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org3.vegi.com/tlsca/tlsca.org3.vegi.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/org3.vegi.com/ca
  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/peers/peer0.org3.vegi.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/org3.vegi.com/ca/ca.org3.vegi.com-cert.pem

  mkdir -p organizations/peerOrganizations/org3.vegi.com/users
  mkdir -p organizations/peerOrganizations/org3.vegi.com/users/User1@org3.vegi.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7254 --caname ca-org3 -M ${PWD}/organizations/peerOrganizations/org3.vegi.com/users/User1@org3.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org3.vegi.com/users/User1@org3.vegi.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/org3.vegi.com/users/Admin@org3.vegi.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org3admin:org3adminpw@localhost:7254 --caname ca-org3 -M ${PWD}/organizations/peerOrganizations/org3.vegi.com/users/Admin@org3.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org3/tls-cert.pem
  { set +x; } 3>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org3.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org3.vegi.com/users/Admin@org3.vegi.com/msp/config.yaml

}

function createOrg4() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/org4.vegi.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org4.vegi.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7354 --caname ca-org4 --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7354-ca-org4.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7354-ca-org4.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7354-ca-org4.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7354-ca-org4.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/org4.vegi.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-org4 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-org4 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-org4 --id.name org4admin --id.secret org4adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/org4.vegi.com/peers
  mkdir -p organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7354 --caname ca-org4 -M ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/msp --csr.hosts peer0.org4.vegi.com --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7354 --caname ca-org4 -M ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls --enrollment.profile tls --csr.hosts peer0.org4.vegi.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/org4.vegi.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org4.vegi.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/org4.vegi.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org4.vegi.com/tlsca/tlsca.org4.vegi.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/org4.vegi.com/ca
  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/peers/peer0.org4.vegi.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/org4.vegi.com/ca/ca.org4.vegi.com-cert.pem

  mkdir -p organizations/peerOrganizations/org4.vegi.com/users
  mkdir -p organizations/peerOrganizations/org4.vegi.com/users/User1@org4.vegi.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7354 --caname ca-org4 -M ${PWD}/organizations/peerOrganizations/org4.vegi.com/users/User1@org4.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org4.vegi.com/users/User1@org4.vegi.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/org4.vegi.com/users/Admin@org4.vegi.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org4admin:org4adminpw@localhost:7354 --caname ca-org4 -M ${PWD}/organizations/peerOrganizations/org4.vegi.com/users/Admin@org4.vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org4/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org4.vegi.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org4.vegi.com/users/Admin@org4.vegi.com/msp/config.yaml

}

function createOrderer() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/ordererOrganizations/vegi.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/vegi.com
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/vegi.com/msp/config.yaml

  infoln "Register orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/vegi.com/orderers
  mkdir -p organizations/ordererOrganizations/vegi.com/orderers/vegi.com

  mkdir -p organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com

  infoln "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/msp --csr.hosts orderer.vegi.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/vegi.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/msp/config.yaml

  infoln "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls --enrollment.profile tls --csr.hosts orderer.vegi.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/msp/tlscacerts/tlsca.vegi.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/vegi.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/vegi.com/orderers/orderer.vegi.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/vegi.com/msp/tlscacerts/tlsca.vegi.com-cert.pem

  mkdir -p organizations/ordererOrganizations/vegi.com/users
  mkdir -p organizations/ordererOrganizations/vegi.com/users/Admin@vegi.com

  infoln "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/vegi.com/users/Admin@vegi.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/vegi.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/vegi.com/users/Admin@vegi.com/msp/config.yaml

}
