import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoJEa_FZnDC7FY_FH5TfmouIQpWVRY7tM",
  authDomain: "crud-vue-1b5f4.firebaseapp.com",
  projectId: "crud-vue-1b5f4",
  storageBucket: "crud-vue-1b5f4.appspot.com",
  messagingSenderId: "120371820005",
  appId: "1:120371820005:web:8ce00e39b7659464056b0c",
  measurementId: "G-0K1SFW2C63",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
