import { Stack, Typography } from "@mui/material";

const Body = () => {
	return (
		<Stack spacing={2}>
			<Typography variant='body1' color='initial'>
				<Typography variant='body1' component='span' color='primary'>
					{` Top Level (Air Station): `}
				</Typography>
				Integration of an{" "}
				<Typography variant='body1' component='span' color='warning'>
					{` AQI sensor `}
				</Typography>
				for air quality monitoring, and a{" "}
				<Typography variant='body1' component='span' color='warning'>
					{` DHT22 sensor `}
				</Typography>
				to collect humidity and temperature data.
			</Typography>
			<Typography variant='body1' color='initial'>
				<Typography variant='body1' component='span' color='primary'>
					{` Bottom Level (Water Station): `}
				</Typography>
				Integration of a{" "}
				<Typography variant='body1' component='span' color='secondary'>
					{` TDS sensor `}
				</Typography>
				for measuring total dissolved solids in seawater, and a
				<Typography variant='body1' component='span' color='secondary'>
					{` DS18B20  `}
				</Typography>
				sensor to capture precise water temperature readings.
			</Typography>
			<Typography variant='body1' color='initial'>
				<Typography variant='body1' component='span' color='primary'>
					{` Arduino Rev4: `}
				</Typography>
				Equipped with an Arduino Rev4 module to handle{" "}
				<Typography variant='body1' component='span' color='success'>
					{` data acquisition `}
				</Typography>{" "}
				and{" "}
				<Typography variant='body1' component='span' color='success'>
					{` transmission over Wi-Fi `}
				</Typography>
				, enabling seamless connectivity for real-time data monitoring.
			</Typography>
			<Typography variant='body1' color='initial'>
				<Typography variant='body1' component='span' color='primary'>
					{` Solar Panel: `}
				</Typography>
				A solar panel is attached to the outer shell to power the Arduino board and ensure{" "}
				<Typography variant='body1' component='span' color='error'>
					{` continuous, sustainable operation. `}
				</Typography>
			</Typography>
			<Typography variant='body1' color='initial'>
				<Typography variant='body1' component='span' color='primary'>
					{` Wind Turbine: `}
				</Typography>
				A wind turbine installed at the top level measures the
				<Typography variant='body1' component='span' color='warning'>
					{` average wind speed `}
				</Typography>
				by using the{" "}
				<Typography variant='body1' component='span' color='warning'>
					{`  analog voltage output. `}
				</Typography>
			</Typography>
		</Stack>
	);
};

export default Body;
