import { Stack, Typography } from "@mui/material";

const Header = () => {
	return (
		<Stack spacing={2}>
			<Typography variant='body1' color='initial'>
				The
				<Typography variant='body1' component='span' color='primary'>
					{` SeaLution `}
				</Typography>
				project focuses on designing and developing a
				<Typography variant='body1' component='span' color='primary'>
					{` self-sustaining, capsule-shaped `}
				</Typography>
				device that collects marine
				<Typography variant='body1' component='span' color='primary'>
					{` ecosystem data `}
				</Typography>
				and is powered by
				<Typography variant='body1' component='span' color='primary'>
					{` solar energy`}
				</Typography>
				.
			</Typography>
			<Typography variant='body1' color='initial'>
				By:
				<Typography variant='body1' component='span' color='warning'>
					{` Raneem Albader`}
				</Typography>
				,
				<Typography variant='body1' component='span' color='success'>
					{` Yazeed Alsuboh`}
				</Typography>
				,
				<Typography variant='body1' component='span' color='secondary'>
					{` Mohammed Karasneh`}
				</Typography>
			</Typography>
		</Stack>
	);
};

export default Header;
