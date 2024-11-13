import { Container, Divider, Typography } from "@mui/material";
import Header from "./components/Header";
import Body from "./components/Body";
import Diagram from "./components/Diagram";
import Data from "./components/Data";
import Download from "./components/Download";

function App() {
	return (
		<Container maxWidth='sm' sx={{ textAlign: "center" }}>
			<Typography variant='h2' color='primary'>
				SeaLution Project
			</Typography>
			<Divider variant='middle' sx={{ margin: 2 }}>
				<Typography variant='body1' color='initial'>
					Introduction
				</Typography>
			</Divider>
			<Header />
			<Divider variant='middle' sx={{ margin: 2 }}>
				<Typography variant='body1' color='initial'>
					Terminology
				</Typography>
			</Divider>
			<Body />
			<Divider variant='middle' sx={{ margin: 2 }}>
				<Typography variant='body1' color='initial'>
					Diagram
				</Typography>
			</Divider>
			<Diagram />
			<Divider variant='middle' sx={{ margin: 2 }}>
				<Typography variant='body1' color='initial'>
					Data Sample
				</Typography>
			</Divider>
			<Data />
			<Divider variant='middle' sx={{ margin: 2 }}>
				<Typography variant='body1' color='initial'>
					Download Data
				</Typography>
			</Divider>
			<Download />
		</Container>
	);
}

export default App;
