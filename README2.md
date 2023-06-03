# Project: AMDEX Data Exchange Platform

## Introduction

The AMDEX Data Exchange Platform is a state-of-the-art system designed to allow AMDEX's customers to securely share data with each other without having to expose all their private data. The system leverages the power of Hyperledger Fabric - a permissioned blockchain technology, and Zero-Knowledge Proof - a cryptographic method that ensures maximum privacy and confidentiality.

## Overview

Data security, privacy and confidentiality are major concerns in today's interconnected world. The AMDEX Data Exchange Platform is built to address these issues head-on. The system allows AMDEX customers to engage in data transactions, ensuring that the required data is shared without exposing sensitive information. It employs Hyperledger Fabric to provide a secure, permissioned blockchain infrastructure and Zero-Knowledge Proof to guarantee data privacy.

## Core Features

- **Hyperledger Fabric:** This is the fundamental infrastructure of our system, providing an enterprise-grade, permissioned blockchain framework. It ensures all transactions are secure, transparent, and traceable.

- **Zero-Knowledge Proof:** This cryptographic technique allows one party (the prover) to prove to another party (the verifier) that they know a value, without conveying any other information apart from the fact they know the value. This guarantees data privacy during transactions.

- **Data Security:** Our platform is designed with a strong emphasis on security, ensuring all data transactions are secure and users can have confidence in the system.

- **Privacy-preserving:** We use advanced cryptographic techniques to ensure that while data is shared, the privacy of our users is preserved.

- **Rich Query Support:** With CouchDB integration, complex and rich queries can be performed on the blockchain data.
## Project Structure

The project has three main models, each represented by a .js file:

- `NotaryLog.js`: This is a representation of a Notary Log which is a record of a particular data transaction. It includes participantId, timestamp, type, and logText.
  
- `Participant.js`: This represents a participant in the system. It includes properties such as id, name, and role.
  
- `Policy.js`: This represents a policy that includes properties like name, inputs, outputs, url, hash_type, and hash. 

Each model includes a constructor for initializing new objects and methods for getting and setting object properties. They also include a method for deserializing a JSON buffer into an object of the respective class.

## Installation

This guide will walk you through the installation process of the AMDEX Data Exchange Platform.

### Prerequisites

Before installing the platform, make sure your system meets the following prerequisites:

1. Operating System: Ubuntu 18.04 or higher, MacOS 10.14 or higher
2. Node.js: Version 12.x or higher (You can download it from [here](https://nodejs.org/en/download/))
3. Docker: Latest version (Download and instructions available [here](https://www.docker.com/get-started))
4. Docker Compose: Latest version 
5. Hyperledger Fabric: Latest version (Download and instructions available [here](https://hyperledger-fabric.readthedocs.io/en/latest/install.html#download-fabric-samples-docker-images-and-binaries))
6. CouchDB v3.1.1

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
`podman` to use podman to download the Fabric Container Images  
`binary` to download the Fabric binaries  
`samples` to clone the fabric-samples github repo to the current directory

If no arguments are supplied, then the arguments `docker binary samples` are assumed.

### Installation Steps Amdex Hyperledger fabric notary blockchain

#### Step 1: Clone the Repository

Navigate to the directory where you want to clone the repository and run the following command:

```bash
git clone https://gitlab.fdmci.hva.nl/blockchain/2022-2023-2/02-team-temp.git
```

#### Step 2: Install Dependencies

Navigate to the cloned repository's backend directory:

```bash
export FABRIC_PATH=~/fabric-samples
cd ~/02-team-temp/client/backend/
```

Then install the necessary Node.js dependencies:

```bash
npm --logevel=error install
```

#### Step 3: Build the Network

To build your Hyperledger Fabric network, navigate to the `network` directory and execute the `network.sh` script with the `up` option:

```bash
cd network
./network.sh down
./network.sh up createChannel -ca -s couchdb
```

#### Step 4: Deploying the contract on the network

```bash
./network.sh deployCC -ccn notary-chaincode -ccp ~/02-team-temp/chaincode -ccv 1 -ccs 1 -ccl javascript
```

#### Step 5: Start the API Server

Return to the root directory and start the API server:

```bash
cd ..
npm start
```

You should now have the AMDEX Data Exchange Platform running on your system.

### Troubleshooting

If you encounter any problems during installation, please check the following:

- Ensure that all prerequisites are correctly installed.
- Make sure Docker services are running.
- Check Node.js and npm versions.
- Try to clean the network with the command `./network.sh down` and build it again.

## Usage

This guide will provide you with detailed instructions on how to use the AMDEX Data Exchange Platform.

### Participants

Participants in this system can be of various roles, and they can create, update and query their details. 

```javascript
// Create a new participant
const newParticipant = new Participant(id, name, role);
// Update a participant
newParticipant.setName("New Name");
newParticipant.setRole("New Role");
```

### NotaryLog

A NotaryLog is a record of a significant event, usually a change in data or a transaction. 

```javascript
// Create a new notary log
const newLog = new NotaryLog(participantId, timestamp, type, logText);
// Update log text
newLog.setLogText("New log text");
```

### Policies

Policies represent the permissions and restrictions for sharing data.

```javascript
// Create a new policy
const newPolicy = new Policy(name, inputs, outputs, url, hash_type, hash);
// Update policy name
newPolicy.setName("New policy name");
```

### Interaction with the Blockchain

#### Add State

```javascript
const state = { /* state data */ };
const key = State.makeKey(['State', 'key']);
await ctx.stateList.addState(key, state);
```

#### Update State

```javascript
const state = await ctx.stateList.getState(key);
state.value = "new value";
await ctx.stateList.updateState(state);
```

#### Query State

```javascript
const state = await ctx.stateList.getState(key);
```

#### Delete State

```javascript
await ctx.stateList.deleteState(key);
```

### Network Interaction

Once the network is up and running, you can interact with it using the provided API. Use tools like curl or Postman to send HTTP requests.

#### Create a Participant

**Endpoint:** `/api/participant`
**Method:** `POST`
**Body:** 

```json
{
    "id": "participant1",
    "name": "John Doe",
    "role": "Data Provider"
}
```

#### Create a Policy

**Endpoint:** `/api/policy`
**Method:** `POST`
**Body:** 

```json
{
    "name": "Policy1",
    "inputs": ["Data1", "Data2"],
    "outputs": ["Data3", "Data4"],
    "url": "http://example.com",
    "hash_type": "SHA256",
    "hash": "abcd1234efgh5678"
}
```

#### Create a NotaryLog

**Endpoint:** `/api/notaryLog`
**Method:** `POST`
**Body:** 

```json
{
    "participantId": "participant1",
    "timestamp": "2023-05-31T10:20:30Z",
    "type": "Transaction",
    "logText": "Participant1 transferred data to Participant2"
}
```

This guide should provide you with a detailed overview of how to interact with the AMDEX Data Exchange Platform. If you need further assistance or have questions, please contact us at [support@amdex.com](mailto:support@amdex.com).


## Contribution

We welcome contributions from the community. Please refer to the CONTRIBUTING.md guide for more details.

## Contact

For more information, please contact the AMDEX team at [contact@amdex.com](mailto:contact@amdex.com).

## License

This project is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).