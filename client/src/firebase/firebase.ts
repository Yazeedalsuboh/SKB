import { initializeApp } from "firebase/app";
import { getDocs, getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	measurementId: import.meta.env.VITE_MEASURMENT_ID,
};

let app: any;
let fireStoreDB: any;

const initializeFirebaseApp = () => {
	try {
		app = initializeApp(firebaseConfig);
		fireStoreDB = getFirestore();
	} catch (err) {
		console.log(err);
	}
};

const retrieveData = async () => {
	try {
		const collectionRef = collection(fireStoreDB, "data");
		const snapshot = await getDocs(collectionRef);
		const data = snapshot.docs.map((doc) => ({
			...doc.data(),
		}));
		return data;
	} catch (err) {
		console.log(err);
	}
};

const firebaseApp = {
	initializeFirebaseApp,
	retrieveData,
};

export default firebaseApp;
