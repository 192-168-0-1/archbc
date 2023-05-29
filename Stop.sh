REPO="$(dirname -- "${BASH_SOURCE[0]}")"
REPO="$(cd -- "$REPO" && pwd)"
WALLETFOLDER="$REPO/client/backend/wallet"

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

#Remove the old wallet folder
if [ -d "$WALLETFOLDER" ]; then
rm -r $WALLETFOLDER
fi

#bring the old network down
$SAMPLES/fabric-samples/test-network/network.sh down