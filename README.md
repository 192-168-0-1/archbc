# Enabling Green Energy Transactions with Hyperledger Fabric

This project is a blockchain application for trading renewable energy, built with Hyperledger Fabric. It is based on the [Hyperledger Fabric Samples](https://github.com/hyperledger/fabric-samples) and has been modified to suit the specific needs of this project.

## Use Case

The goal of this use case is to promote green energy adoption and make peer-to-peer energy trading easier by implementing a permissioned blockchain network using Hyperledger Fabric.

### Motivations

The motivations behind picking this use case are as follows:

- **Positive impact on the environment**: Encouraging the adoption of renewable energy can help reduce greenhouse gas emissions, contributing to a greener future.

- **Decentralization**: This use case demonstrates how a permissioned blockchain network based on Hyperledger Fabric can enable peer-to-peer energy trading, empowering individual prosumers and promoting energy independence.

- **Ethical and social consideration**: Our case encourages discussions about the ethical and social impacts of using blockchain technology in the renewable energy sector.

- **Stakeholders collaborations**: There is a need for cooperation among different stakeholders in the renewable energy ecosystem, including prosumers, regulatory bodies, and energy sellers.

## Project Structure

The project is divided into two main parts: the chaincode and the client.

### Chaincode

The chaincode directory contains the smart contracts for the blockchain network. It includes the following files:

- `index.js`: This file exports the smart contracts to be used in the blockchain network. It is the entry point for the chaincode execution.

- `energy-trading-contract.js`: This file defines the smart contract for energy trading. It includes the logic for creating and updating energy assets, and for trading energy between participants.

- `identity-contract.js`: This file defines the smart contract for managing identities in the blockchain network. It includes the logic for creating and updating participant identities.

The `models` subdirectory contains the models for the different entities in the blockchain network:

- `EnergyTrading.js`: This file defines the model for an energy trading asset. It includes the properties of the asset and methods for managing the asset's state.

- `Participant.js`: This file defines the model for a participant in the blockchain network. It includes the properties of the participant and methods for managing the participant's state.

- `State.js`: This file defines the base model for a state in the blockchain network. It includes methods for converting the state to and from a buffer.

The `roles` subdirectory contains the roles for the different entities in the blockchain network:

- `role.js`: This file defines the roles that a participant can have in the blockchain network. It is used to enforce access control in the smart contracts.

### Client

The client directory contains the backend for the client application. It includes the following files:

- `package.json`: This file lists the dependencies of the client application. It also includes scripts for running the application and other metadata.

The `backend` subdirectory contains the backend for the client application:

- `package.json`: This file lists the dependencies of the backend of the client application. It also includes scripts for running the application and other metadata.

- `config.json`: This file contains the configuration for the backend of the client application. It includes information such as the network configuration and the admin user.

The `backend/roles` subdirectory contains the roles for the different entities in the client application:

- `role.js`: This file defines the roles that a user can have in the client application. It is used to enforce access control in the application.

The `backend/src` subdirectory contains the source code for the backend:

- `app.js`: This file is the entry point for the backend of the client application. It sets up the express server and the routes for the application.

- `enroll-admin.js`: This file contains the script for enrolling an admin user with the certificate authority. It is used to set up the admin user for the first time.

- `event-handler.js`: This file contains the logic for handling events from the blockchain network. It includes a WebSocket server for sending events to the client application.

The `backend/src/fabric` subdirectory contains the network configuration for the Fabric network:

- `network.js`: This file contains the logic for interacting with the Hyperledger Fabric network. It includes methods for registering and enrolling users, connecting to the network, and invoking transactions on the smart contracts.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- [Node.js and npm](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)

## Installation

This guide will walk you through the installation process of the Energy trading platfor.

### Prerequisites

Before installing the platform, make sure your system meets the following prerequisites from the official [website](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) of hyperledger-fabric.

### Installation Steps Hyperledger fabric

#### Step 1 download Hyperledger fabric

Navigate to the directory where you want to work in and clone the hyperledger fabric repository in with the following command:

```bash
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
```

#### Step 2 install necessary dependencies

Install the necessary dependencies for this hyperledger project with the following command:
```bash
./install-fabric.sh d s b
```
If other dependencies are required, specify the components to download add one or more of the following arguments. Each argument can be shortened to its first letter.

`docker` to use Docker to download the Fabric Container Images   
`binary` to download the Fabric binaries  
`samples` to clone the fabric-samples github repo to the current directory

### Running the blockchain and smartcontract

#### Step 1: Build the Network
First Nagivate to recently downloaded fabric-samples/test-network folder and run:
```bash
./network.sh down
./network.sh up createChannel -ca -s couchdb
```

#### Step 2: Deploying the contract on the network

```bash
/network.sh deployCC -ccn energy-trading-chaincode -ccp [Base-folder]/blockchain-architecture/chaincode -ccv 1 -ccs 1 -ccl javascript
```

#### Step 3: Install Dependencies

Export the fabric path:

```bash
export FABRIC_PATH=~/fabric-samples
```

Then move to the blockchain-architecture/client/backend folder and install the necessary Node.js dependencies:

```bash
npm --logevel=error install
```

#### Step 4: Enrolling the admin

Enroll the admin like so:
(note if there is already an Admin.id file present, this should be deleted before running the command again)

```bash
node src/enroll-admin.js
```

#### Step 5: Start the API Server

Start the API server:

```bash
npm start
```

To stop, you can run `./network.sh down` in the `fabric-samples/test-network`

## Making API Calls

These instructions will guide you on how to make API calls to the project. 

You can use any API client like [Postman](https://www.postman.com/downloads/) or [curl](https://curl.se/) to make these calls.

Here are some example API calls:

1. To register a new participant:
   ```
   POST /participants
   Content-Type: application/json

   {
     "id": "participant1",
     "name": "Participant 1",
     "role": "Role1"
   }
   ```

2. To get a participant:
   ```
   GET /participants/participant1
   ```

3. To update a participant's role:
   ```
   PUT /participants/participant1/role
   Content-Type: application/json

   {
     "name": "Participant 1",
     "role": "Role2"
   }
   ```

4. To create an asset:
   ```
   POST /rest/assets
   Content-Type: application/json

   {
     "participantId": "participant1",
     "id": "asset1",
     "producer": "Producer1",
     "energyType": "Type1",
     "units": 100
   }
   ```

5. To trade energy:
   ```
   POST /rest/trade
   Content-Type: application/json

   {
     "buyerId": "participant2",
     "buyingAssetNumber": "asset2",
     "sellerId": "participant1",
     "sellingAssetNumber": "asset1",
     "units": 50
   }
   ```

6. To get an asset:
   ```
   GET /rest/asset/asset1
   ```

7. To get an asset's history:
   ```
   GET /rest/asset/asset1/history
   ```

8. To update an asset:
   ```
   PUT /rest/asset/asset1
   Content-Type: application/json

   {
     "newValue": 200
   }
   ```

9. To delete an asset:
    ```
    DELETE /rest/asset/asset1
    ```