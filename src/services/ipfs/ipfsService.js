import ipfsClient from 'ipfs-http-client';
import resolve from 'ipfs-http-client/src/resolve';

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
export const ipfsGateway = 'https://ipfs.infura.io/ipfs/';

//to convert the file to buffer array
const fileToBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.onload = () => {
            resolve(Buffer(reader.result));
        }
        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
}

export const downloadFile = async (url) => {
    //download the file from firebase storage and convert it into buffer
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            var blob = xhr.response;
            resolve(blob);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.send();
    });
}

//uploads file on infura public ipfs and returns the hash
export const uploadFile = async (data) => {
    const fileBuffer = await fileToBuffer(data);
    const result = await ipfs.add(fileBuffer);
    console.log(result.path);
    return result.path;
}
