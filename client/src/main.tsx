import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { FirebaseProvider } from "./context/FirebaseContext.tsx";

createRoot(document.getElementById("root")!).render(
	<FirebaseProvider>
		<StrictMode>
			<App />
		</StrictMode>
	</FirebaseProvider>
);
