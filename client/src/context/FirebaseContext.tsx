import React, { createContext, useContext, useEffect } from "react";
import firebaseApp from "../firebase/firebase";

interface FirebaseContextProps {
	getSensorsData: () => Promise<any>;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	useEffect(() => {
		firebaseApp.initializeFirebaseApp();
	}, []);

	const getSensorsData = async () => {
		try {
			const data = firebaseApp.retrieveData();
			return data;
		} catch (error) {
			console.error("Error fetching air humidity data:", error);
			return null;
		}
	};

	return <FirebaseContext.Provider value={{ getSensorsData }}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
	const context = useContext(FirebaseContext);
	if (!context) {
		throw new Error("useFirebase must be used within a FirebaseProvider");
	}
	return context;
};
