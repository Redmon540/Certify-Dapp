import Web3 from "web3";
import * as dbService from '../firebase/databaseService';
import abi from '../../contract/contract_abi.json';
import byte_code from '../../contract/byte_code.json';

//infura end point
const infuraEndpoint = 'https://ropsten.infura.io/v3/d015a88ae875483c80e72a899d7eb8ba';

// var provider = 'http://127.0.0.1:7545';
var Contract = require('web3-eth-contract');
Contract.setProvider(Web3.givenProvider || infuraEndpoint);

//set up the campaign factory
let factoryAddress;
let factory;

let currentAccount;


//web3 singleton
let web3 = new Web3(Web3.givenProvider || infuraEndpoint);

//listen for metamask account change
export const listenAccountChange = (userAddress, appContext) => {
    if (web3.givenProvider) {
        web3.givenProvider.on('accountsChanged', function (accounts) {
            currentAccount = web3.utils.toChecksumAddress(accounts[0]);
            appContext.setCurrentUserAccount(currentAccount);
            appContext.setIsUserAccountSelected(currentAccount == userAddress);
        });
    }
}

export const listenNetworkChange = (appContext) => {
    if (web3.givenProvider) {
        web3.givenProvider.on('networkChanged', function (networkId) {
            appContext.setCurrentNetwork(networkId);
        });
    }
}

export const enable = async (appContext) => {
    // //get campagin factory address from firebase
    // factoryAddress = await getCampaginFactoryAddress();
    // factory = new Contract(CAMPAIGN_FACTORY_ABI, factoryAddress);

    if (web3.givenProvider) {

        //get current account
        currentAccount = web3.utils.toChecksumAddress((await web3.eth.requestAccounts())[0]);
        appContext.setCurrentUserAccount(currentAccount);

        //get network id
        const networkId = await web3.eth.net.getId();

        appContext.setCurrentNetwork(networkId);
        return true;
    }
    return false;
}

export const toChecksumAddress = (address) => web3.utils.toChecksumAddress(address);

export const toWei = (value) => web3.utils.toWei(value, 'ether');

export const deployInstituteContract = async () => {
    try {
        const contract = new Contract(abi);
        const result = await contract.deploy({
            data: "0x" + byte_code["object"]
        })
            .send({ from: currentAccount });
        return toChecksumAddress(result._address);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const addCertificate = async (contractAddress, studentAddress, ipfsHash) => {
    try {
        const contract = new Contract(abi, contractAddress);
        const tx = await contract.methods
            .addCertificate(studentAddress, ipfsHash)
            .send({ from: currentAccount });
        return tx.transactionHash;
    }
    catch (e) {
        return null;
    }
}