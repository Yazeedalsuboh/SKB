import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext";
import DownloadIcon from "@mui/icons-material/Download";
import { Chip, Grid2, Button, Stack } from "@mui/material";

const Download = () => {
	const [values, setValues] = useState<number[]>([]);

	const { getSensorsData } = useFirebase();

	const [selectedChip, setSelectedChip] = useState("air_heat_index_c");
	const chipLabels = ["air_heat_index_c", "air_humidity", "air_quality", "air_temp_c", "water_ds", "water_tds"];
	const handleChipClick = (label: string) => {
		setSelectedChip(label);
	};

	const downloadCSV = () => {
		const cols = "Values\n" + values.join("\n");
		const csvContent = cols;
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "data.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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

	return (
		<Stack spacing={{ xs: 2 }}>
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
			</Grid2>
			<Grid2 size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
				<Button variant='outlined' color='primary' startIcon={<DownloadIcon sx={{ ml: 1 }} />} onClick={downloadCSV}>
					Download CSV
				</Button>
			</Grid2>
		</Stack>
	);
};

export default Download;
