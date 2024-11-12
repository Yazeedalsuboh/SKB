import express, { NextFunction, Request, Response } from 'express';
import { SERVER_HOSTNAME, SERVER_PORT } from './config/config';
import { firebaseApp } from './config/firebase';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('Server is ON and working!');
});

app.post('/', (req: Request, res: Response, next: NextFunction) => {
	const { payload } = req.body;

	console.log(payload);
	firebaseApp.uploadProcessedData(payload);
	res.send('data upload route');
});

app.listen(SERVER_PORT, () => {
	console.log(`Server is running on http://${SERVER_HOSTNAME}:${SERVER_PORT}`);
	firebaseApp.initializeFirebaseApp();
});
