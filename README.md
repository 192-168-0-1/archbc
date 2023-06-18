# Environment variables

Make sure to creat a new file in 'client/backend/' called '.env' having the following content:

CONFIG_CONNECTION_PROFILE=test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
CONFIG_MSPID=Org1MSP
CONFIG_CA_NAME=ca.org1.example.com
PATH_URL=org1.example.com
PATH_JSON_CONNECTION=connection-org1.json
CONFIG_ORG=org1



# Starting the applciation:

cd ~/fabric-samples/test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn notary-chaincode -ccp ../../02-team-temp/chaincode -ccv 1 -ccs 1 -ccl javascript
export FABRIC_PATH=~/fabric-samples
cd ../../02-team-temp/client/backend/
npm --logevel=error install
node src/enroll-admin.js
npm start