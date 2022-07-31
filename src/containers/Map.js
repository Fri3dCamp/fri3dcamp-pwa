import React from "react";
import TopBar from "../components/UI/TopBar";
import Floorplan from "../components/Floorplan/Floorplan";

class Map extends React.Component {
	componentDidMount() {
		document.title = "Vloerplan - Fri3d Camp";
	}

	render() {
		return (
			<>
				<TopBar title="Kaart" backLink="/" />
				<div style={{ flex: "1" }}>
					<Floorplan style={{ position: "relative" }} />
				</div>
			</>
		);
	}
}

export default Map;
