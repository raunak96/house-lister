import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDYxXeTUitBclVPF9jYXnj7H1Xypdxhrw8",
	authDomain: "house-lister-a635e.firebaseapp.com",
	projectId: "house-lister-a635e",
	storageBucket: "house-lister-a635e.appspot.com",
	messagingSenderId: "401356684327",
	appId: "1:401356684327:web:b08e7b82ed80b475276202",
};
initializeApp(firebaseConfig);

const db = getFirestore();
export default db;
