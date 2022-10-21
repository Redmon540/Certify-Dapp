pragma solidity 0.5.0;
contract Institute {
    
    uint studentCount;
    mapping(uint=>address) studentAddresses;
    mapping(address=>string[]) studentCertificate;
    mapping(string=>bool) ipfsHashes;
    address owner;

    constructor() public{
        owner = msg.sender;
    }
    
    modifier onlyOwner(){ require(owner == msg.sender,'Only Owner can call this function'); _; }

    function addCertificate( address studentAddress, string memory certificateHash) onlyOwner public{
           string[] storage certificates = studentCertificate[studentAddress];

           if(certificates.length == 0){
               studentCount++;
               studentAddresses[studentCount] = studentAddress;
           }
            certificates.push(certificateHash);
            ipfsHashes[certificateHash] = true;
    }
    
    function verifyCertificate(string memory ipfsHash) public view returns(bool){
        return ipfsHashes[ipfsHash];
    }

}