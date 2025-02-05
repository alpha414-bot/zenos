import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-w9v45sGFqymT0_3OwqExBxc4MFur0tk",
  authDomain: "zenos-ecommerce.firebaseapp.com",
  projectId: "zenos-ecommerce",
  storageBucket: "zenos-ecommerce.firebasestorage.app",
  messagingSenderId: "354715463819",
  appId: "1:354715463819:web:ccb15c2a017599a21de48e",
  measurementId: "G-V1XNM8WP44",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyCIdRVESOrRuy-MkOawsemsZqcYw5TvQSQ",
//   authDomain: "vint-ecommerce.firebaseapp.com",
//   databaseURL: "https://vint-ecommerce-default-rtdb.firebaseio.com",
//   projectId: "vint-ecommerce",
//   storageBucket: "vint-ecommerce.firebasestorage.app",
//   messagingSenderId: "875924243691",
//   appId: "1:875924243691:web:39c861280476191c30eaae",
//   measurementId: "G-GW51SXRFJ3"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// const IP = "192.168.0.3";
// const IP = "127.0.0.1";
// connectAuthEmulator(auth, `http://${IP}:9099`);
// connectFirestoreEmulator(firestore, IP, 8080);
// connectStorageEmulator(storage, IP, 9199);

export { app, auth, firestore, storage };

