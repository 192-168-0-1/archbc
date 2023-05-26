
REPO="$(dirname -- "${BASH_SOURCE[0]}")"
REPO="$(cd -- "$REPO" && pwd)"

#check if a different path is specified
if [ -z "$1" ]; then
SAMPLES="$HOME"
else
SAMPLES="$1"
fi 

#Check if given path is correct
if [ ! -d "$SAMPLES/fabric-samples" ]; then
    echo "wrong Path specified"
    exit 1
fi

./Stop.sh

#start the new network and deploy ChainCode
$SAMPLES/fabric-samples/test-network/network.sh up createChannel -ca -s couchdb
$SAMPLES/fabric-samples/test-network/network.sh deployCC -ccn notary-chaincode -ccp $REPO/chaincode -ccv 1 -ccs 1 -ccl javascript

export FABRIC_PATH=$SAMPLES/fabric-samples 

#Start the node server
cd $REPO/client/backend/
npm --logevel=error install 

node src/enroll-admin.js

npm start