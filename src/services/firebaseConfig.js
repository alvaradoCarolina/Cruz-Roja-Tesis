import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD2DY-Y-kTwqh5s7nFLnpc_CFMDgKGJ36U",
    authDomain: "cruzroja-ebfc2.firebaseapp.com",
    projectId: "cruzroja-ebfc2",
    storageBucket: "cruzroja-ebfc2.appspot.com",
    messagingSenderId: "144494585175",
    appId: "1:144494585175:web:8ca645a68b52eff251ca12"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
