import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
    apiKey: "AIzaSyBleVqQicgojWUh5sICrfn25Rfu-eUhgec",
    authDomain: "de-certify.firebaseapp.com",
    databaseURL: "https://de-certify.firebaseio.com",
    projectId: "de-certify",
    storageBucket: "de-certify.appspot.com",
    messagingSenderId: "65602283840",
    appId: "1:65602283840:web:651a4f17918af908b832a5"
};

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();
export const storage = firebase.storage();
export const auth = firebase.auth();