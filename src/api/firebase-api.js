import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCthnQ1Sew1QIesYMalcFQbup487Lbvgkg", // ok to publicly display
  authDomain: "shauralportfolio.firebaseapp.com",
  projectId: "shauralportfolio",
  storageBucket: "shauralportfolio.appspot.com",
  messagingSenderId: "364313284244",
  appId: "1:364313284244:web:6619fd169b8eefa0f5ee81",
  measurementId: "G-15FHP4V0FR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getLocations() {
  const querySnapshot = await getDocs(collection(db, "locations"));
  let acc = [];
  querySnapshot.forEach(doc => {
    acc.push(doc.data());
  });
  return acc;
}

export { getLocations };
