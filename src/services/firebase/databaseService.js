import { database } from './config';

const write = async (node, jsonData) => {
    await database.ref(node).set(jsonData);
}

const read = async (path) => {
    return (await database.ref(path).once('value')).val();
}

//-------------------------------PUBLIC METHODS---------------------------------//
export const setUser = async (address, user) => {
    await write(`users/${address}`, user);
}

export const getUserByAddress = async (address) => {
    const user = await read(`users/${address}`);
    return user;
}

export const getUserByEmail = async (email) => {
    const user = (await database.ref('users').orderByChild('email').equalTo(email).once('value')).val();
    if (user) {
        return user[[Object.keys(user)[0]]];
    }
    return null;
}

export const getAllStudents = async (instituteAddress) => {
    return (await database.ref('users').orderByChild(`instituteAddress`).equalTo(`${instituteAddress}`).once('value')).val();
}

export const getAllStudentsCount = async (instituteAddress) => {
    return (await database.ref('users').orderByChild(`instituteAddress`).equalTo(`${instituteAddress}`).once('value')).numChildren();
}

export const getAllInstitutes = async () => {
    return (await database.ref('users').orderByChild(`accountType`).equalTo(`Institute`).once('value')).val();
}

export const setCertificate = async (key, certificate) => {
    await database.ref(`certificates/${key}/`).set(certificate);
}

export const getCertificate = async (key) => {
    return await read(`certificates/${key}`);
}

export const getCertificateByIpfsHash = async (hash) => {
    const value = (await database.ref('certificates').orderByChild(`ipfsHash`).equalTo(`${hash}`).once('value')).val();
    if (value) {
        return Object.keys(value)[0];
    }
    return null;
}

export const getStudentCertificates = async (studentAddress) => {
    return (await database.ref('certificates').orderByChild(`studentAddress`).equalTo(`${studentAddress}`).once('value')).val();
}

export const getInstituteCertificates = async (instituteAddress) => {
    return (await database.ref('certificates').orderByChild(`instituteAddress`).equalTo(`${instituteAddress}`).once('value')).val();
}

export const getInstituteCertificatesCount = async (instituteAddress) => {
    return (await database
        .ref('certificates')
        .orderByChild(`instituteAddress`)
        .equalTo(`${instituteAddress}`)
        .once('value')
    ).numChildren();
}

export const setCertificateVisibility = async (key, visibility) => {
    await database.ref(`certificates/${key}/visibility/`).set(visibility);
}

export const setCertificateStatus = async (key, status) => {
    await database.ref(`certificates/${key}/status/`).set(status);
}

//Student/Institute structure
// users: {
//     address: {
//         name: "user name",
//         address: "sample address",
//         email: "test@test.com",
//         imgUrl: "url",
//         instituteAddress: "institute address", (this field is only for students)
//         accountType: "Student | Institute"
//     }
// }

//certificates: {
//         guid-key : {
//              imgUrl:
//              ipfsHash:
//              transactionHash: 
//              name:
//              description:
//              visibility:
//              status:
//              studentAddress:
//              instituteAddress:
//       }
// }