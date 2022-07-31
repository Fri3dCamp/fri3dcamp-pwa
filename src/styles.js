const styles = (theme) => ({
	appBar: {
		width: "100%",
		minHeight: "50px",
	},
	appBarImage: {
		minHeight: "250px",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center center",
		transition: "min-height 0.2s",
	},
	root: {
		margin: "0 auto",
		maxWidth: 1140,
		padding: theme.spacing.unit * 2,
	},
	grow: {
		flexGrow: 1,
	},
	bottomNavigation: {
		width: "100%",
		position: "fixed",
		bottom: 0,
		zIndex: 401,
	},
	programList: {
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 20,
	},
	media: {
		height: 0,
		paddingTop: "56.25%", // 16:9
	},
});

export default styles;
