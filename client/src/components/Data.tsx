import { useEffect, useState } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { Chip, Grid2 } from "@mui/material";

const Data = () => {
	const [values, setValues] = useState<number[]>([]);
	const { getSensorsData } = useFirebase();
	const [selectedChip, setSelectedChip] = useState("air_heat_index_c");
	const chipLabels = ["air_heat_index_c", "air_humidity_rh", "air_quality_ppm", "air_temp_c", "water_ds_c", "water_tds_ppm", "wind_speed"];
	const handleChipClick = (label: string) => {
		setSelectedChip(label);
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await getSensorsData();
			if (data) {
				let arr: number[] = [];
				data[0][selectedChip].map((ele: any) => {
					arr.push(ele["value"]);
				});
				setValues(arr);
			}
		};
		fetchData();
	}, [selectedChip]);

	const chartData = {
		labels: Array.from({ length: 50 }, (_, i) => i * 5),
		datasets: [
			{
				label: `${selectedChip
					.split("_")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
					.join(" ")}`,
				data: values,
				borderColor: "rgba(75,192,192,1)",
				backgroundColor: "rgba(75,192,192,0.2)",
				fill: false,
				tension: 0.1,
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			x: { title: { display: true, text: "Time" } },
			y: { title: { display: true, text: selectedChip.slice(selectedChip.lastIndexOf("_") + 1).toUpperCase() } },
		},
	};

	return (
		<Grid2 container spacing={{ xs: 1 }} size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
			{chipLabels.map((label) => (
				<Chip
					key={label}
					label={label
						.split("_")
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
						.join(" ")}
					clickable
					color={selectedChip === label ? "primary" : "default"}
					onClick={() => handleChipClick(label)}
					variant={selectedChip === label ? "filled" : "outlined"}
				/>
			))}
			<Line data={chartData} options={options} />
		</Grid2>
	);
};

export default Data;
