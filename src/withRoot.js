import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
	palette: {
		light: {
			light: "#71cbdc",
			main: "#4ebed4",
			dark: "#368594",
			contrastText: "#fff",
		},
		secondary: {
			light: "#9d57d4",
			main: "#8835c9",
			dark: "#62298E",
			contrastText: "#fff",
		},
		primary: {
			light: "#97f3d7",
			main: "#3ce8b3",
			dark: "#28a881",
			contrastText: "#fff",
		},
	},
	typography: {
		useNextVariants: true,
		h1: {
			textTransform: "uppercase",
			fontWeight: 700,
			fontSize: "1.75rem",
			color: "#1e2a68",
		},
		h2: {
			textTransform: "uppercase",
			fontWeight: 700,
			fontSize: "1.5rem",
			color: "#1e2a68",
		},
		h3: {
			textTransform: "uppercase",
			fontWeight: 700,
			fontSize: "1.25rem",
			color: "#1e2a68",
		},
		h4: {
			textTransform: "uppercase",
			fontWeight: 400,
			fontSize: "1.15rem",
			color: "#1e2a68",
		},
		h5: {
			textTransform: "uppercase",
			fontWeight: 400,
			fontSize: "1rem",
			color: "#1e2a68",
		},
		h6: {
			textTransform: "uppercase",
			fontWeight: 300,
			fontSize: "0.85rem",
			color: "#1e2a68",
		},
	},
});

function withRoot(Component) {
	function WithRoot(props) {
		return (
			<MuiThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<Component {...props} />
			</MuiThemeProvider>
		);
	}

	return WithRoot;
}

export default withRoot;
