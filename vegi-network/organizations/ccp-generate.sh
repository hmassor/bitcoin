#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/org1.vegi.com/tlsca/tlsca.org1.vegi.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.vegi.com/ca/ca.org1.vegi.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.vegi.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.vegi.com/connection-org1.yaml


ORG=2
# POPORT orig: 9051, CAPORT orig: 8054
P0PORT=7151
CAPORT=7154
PEERPEM=organizations/peerOrganizations/org2.vegi.com/tlsca/tlsca.org2.vegi.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.vegi.com/ca/ca.org2.vegi.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.vegi.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.vegi.com/connection-org2.yaml


ORG=3
P0PORT=7251
CAPORT=7254
PEERPEM=organizations/peerOrganizations/org3.vegi.com/tlsca/tlsca.org3.vegi.com-cert.pem
CAPEM=organizations/peerOrganizations/org3.vegi.com/ca/ca.org3.vegi.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org3.vegi.com/connection-org3.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org3.vegi.com/connection-org3.yaml


ORG=4
P0PORT=7351
CAPORT=7354
PEERPEM=organizations/peerOrganizations/org4.vegi.com/tlsca/tlsca.org4.vegi.com-cert.pem
CAPEM=organizations/peerOrganizations/org4.vegi.com/ca/ca.org4.vegi.com-cert.pem
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org4.vegi.com/connection-org4.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org4.vegi.com/connection-org4.yaml