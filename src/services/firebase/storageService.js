import { storage } from './config';

// Create a storage reference from our storage service
let storageRef = storage.ref();

//to upload profile pictures
export const uploadProfilePic = async (file, name) => {
    await storageRef.child(`profile-pictures/${name}`).put(file);
    const url = await storageRef.child(`profile-pictures/${name}`).getDownloadURL();
    return url;
}

export const deleteProfilePic = async (filename) => {
    await storageRef.child(`profile-pictures/${filename}`).delete();
}

//to upload certificates (only upload certificates when student submit them for approval, 
//and delete them after approval, because they will be directly downloaded from the IPFS node after approval)
export const uploadCertificate = async (file, name) => {
    await storageRef.child(`certificates/${name}`).put(file);
    const url = await storageRef.child(`certificates/${name}`).getDownloadURL();
    return url;
}

export const deleteCertificate = async (filename) => {
    await storageRef.child(`certificates/${filename}`).delete();
}