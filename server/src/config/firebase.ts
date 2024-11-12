import { doc, getFirestore, arrayUnion, setDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { API_KEY, APP_ID, AUTH_DOMAIN, MEASUREMENT_ID, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from './config';

const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	projectId: PROJECT_ID,
	storageBucket: STORAGE_BUCKET,
	messagingSenderId: MESSAGING_SENDER_ID,
	appId: APP_ID,
	measurementId: MEASUREMENT_ID
};

let app: any;
let fireStoreDB: any;
const initializeFirebaseApp = () => {
	try {
		app = initializeApp(firebaseConfig);
		fireStoreDB = getFirestore();
		console.log('Successfully connected to Firebase!');
	} catch (err) {
		console.log(err);
	}
};

const getFirebaseApp = () => app;

const uploadProcessedData = async (payload: any) => {
	const today = new Date();

	const hours = String(today.getHours()).padStart(2, '0');
	const minutes = String(today.getMinutes()).padStart(2, '0');
	const seconds = String(today.getSeconds()).padStart(2, '0');

	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = String(today.getFullYear()).slice(-2);

	const formattedDate = `${month}-${day}-${year}`;

	try {
		const humiditydataRef = doc(fireStoreDB, 'data', formattedDate);

		await updateDoc(humiditydataRef, {
			air_humidity: arrayUnion(
				...payload.map((ele: any) => ({
					id: ele['id'],
					value: ele['air_humidity']
				}))
			),
			air_temp_c: arrayUnion(
				...payload.map((ele: any) => ({
					id: ele['id'],
					value: ele['air_temp_c']
				}))
			),
			air_heat_index_c: arrayUnion(
				...payload.map((ele: any) => ({
					id: ele['id'],
					value: ele['air_heat_index_c']
				}))
			),
			air_quality: arrayUnion(
				...payload.map((ele: any) => ({
					id: ele['id'],
					value: ele['air_quality']
				}))
			),
			water_tds: arrayUnion(
				...payload.map((ele: any) => ({
					id: ele['id'],
					value: ele['water_tds']
				}))
			),
			water_ds: arrayUnion(
				...payload.map((ele: any) => ({
					id: ele['id'],
					value: ele['water_ds']
				}))
			)
		});
	} catch (err) {
		console.log(err);
	}
};

export const firebaseApp = {
	initializeFirebaseApp,
	getFirebaseApp,
	uploadProcessedData
};