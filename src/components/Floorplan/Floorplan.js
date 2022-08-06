import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
	Avatar,
	Button,
	CardActionArea,
	Link as MuiLink,
	Typography,
	withStyles,
} from "@material-ui/core";
import MarkerIcon from "./Marker";
import Filter from "./Filter";
import MapGL, { GeolocateControl, Marker, Popup } from "react-map-gl";
import { connect } from "react-redux";
import {
	getActivities,
	getFilteredFeatures,
	getLocationsByFeature,
} from "../../redux/selectors";
import { Link } from "react-router-dom";
import UpcomingActivities from "../Activities/UpcomingActivities";
import CardHeader from "@material-ui/core/CardHeader";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import EuroSymbolIcon from "@material-ui/icons/EuroSymbol";
import InfoIcon from "@material-ui/icons/Info";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import WcIcon from "@material-ui/icons/Wc";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";

const geolocateStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	margin: 10,
};

const IconMap = {
	restaurant: <RestaurantIcon />,
	euro: <EuroSymbolIcon />,
	info: <InfoIcon />,
	'ehbo': <LocalHospitalIcon />,
	'ehbo post': <LocalHospitalIcon />,
	'infodesk' : <InfoIcon />,
	'sanitair grauwe els' : <WcIcon />,
	'sanitair tamme kastanje' : <WcIcon />,
	'food' : <RestaurantIcon />,
	'day bar' : <LocalBarIcon />,
	'parking' : <DirectionsCarIcon />,
	'kampvuur' : <WhatshotIcon />,
	'campervans/caravans' : <AirportShuttleIcon />,
	bar: <LocalBarIcon />,
	wc: <WcIcon />,
};

const styles = (theme) => ({
	markerLink: {
		maxWidth: "150px",
		maxHeight: "50px",
		display: "flex",
		alignContent: "center",
		alignItems: "center",
		paddingTop: "2px",
		flexDirection: "column",
		justifyContent: "center",
		textAlign: "center",
		transform: `translate(-50%, -25%)`,
		textShadow: "0 0 1px #555",
		cursor: "pointer",
	},
	markerText: {
		display: "inline-block",
		fontSize: "12px",
		maxWidth: "100%",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		color: "#fff",
	},
	avatar: {
		width: 30,
		height: 30,
		background: theme.palette.secondary.main,
		boxShadow: "0 2px 1px rgba(0,0,0,0.35)",
	},
	markerContent: {
		margin: "16px auto",
	},
	popUp: {
		maxWidth: "95%",
		minWidth: "150px",
		overflow: "hidden",
		[theme.breakpoints.up("md")]: {
			maxWidth: "400px",
		},
	},
	popUpHeader: {
		fontWeight: "bold",
		fontSize: "1.25rem",
		textAlign: "center",
	},
});

class Floorplan extends React.Component {
	state = {
		popupInfo: null,
		viewport: {
			latitude : 50.79949,
			longitude : 4.66307,
			zoom: 16,
		},
		settings: {
			dragPan: true,
			dragRotate: false,
			scrollZoom: true,
			touchZoom: true,
			touchRotate: false,
			keyboard: true,
			doubleClickZoom: true,
			minZoom: 15,
			maxZoom: 30,
			maxBounds: this.maxBounds,
			mapStyle: 'mapbox://styles/mapbox/outdoors-v11',
			mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_TOKEN,
		},
	};

	_onViewportChange = (viewport) => {
		const { width, height, ...etc } = viewport;
		this.setState({ viewport: etc });
	};

	handleMarkerClick = (feature) => {
		const { locationsByFeature = {}, activities = {} } = this.props;

		let popupInfo = {
			longitude: feature.coordinates.longitude,
			latitude: feature.coordinates.latitude,
			title: feature.name,
		};

		const fName = feature.name.toLowerCase();

		if (locationsByFeature.hasOwnProperty(fName)) {
			popupInfo.location = locationsByFeature[fName];
		}

		if (
			feature.activityId &&
			activities.hasOwnProperty(feature.activityId)
		) {
			popupInfo.activity = activities[feature.activityId];
		}

		this.setState({
			popupInfo,
		});
	};

	_renderPopup() {
		const { popupInfo } = this.state;
		const { classes } = this.props;

		if (null === popupInfo) return null;

		let content = "";

		if (popupInfo.activity) {
			content = (
				<this.renderActivityPopup activity={popupInfo.activity} />
			);
		} else if (popupInfo.location) {
			content = (
				<this.renderLocationPopup location={popupInfo.location} />
			);
		} else {
			content = <this.renderRegularPopup {...popupInfo} />;
		}

		return (
			<Popup
				tipSize={10}
				anchor="bottom"
				longitude={popupInfo.longitude}
				latitude={popupInfo.latitude}
				closeOnClick={false}
				className={classes.popUp}
				dynamicPosition={false}
				onClose={() => this.setState({ popupInfo: null })}
			>
				{content}
			</Popup>
		);
	}

	renderLocationPopup = ({ location }) => {
		return (
			<>
				<CardActionArea
					component={Link}
					to={`${
						process.env.PUBLIC_URL
					}/location/${location.name.toLowerCase()}`}
				>
					<CardHeader
						title={location.name}
						subheader={location.subTitle}
						avatar={<Avatar src={location.icon} />}
					/>
				</CardActionArea>
				<UpcomingActivities
					title=""
					location={location.name.toLowerCase()}
				/>
			</>
		);
	};

	renderActivityPopup = ({ activity }) => {
		const { classes } = this.props;

		return (
			<>
				<Typography
					variant="h4"
					color="secondary"
					className={classes.popUpHeader}
					noWrap={true}
				>
					{activity.title}
				</Typography>
				<Typography variant="body1" className={classes.markerContent}>
					{activity.excerpt}
				</Typography>
				<Button
					size="small"
					component={Link}
					to={`${process.env.PUBLIC_URL}/activity/${activity.id}`}
					variant="contained"
					color="primary"
				>
					Lees verder
				</Button>
			</>
		);
	};

	renderRegularPopup = ({ title }) => {
		const { classes } = this.props;

		return (
			<Typography
				variant="h4"
				color="secondary"
				className={classes.popUpHeader}
				noWrap={true}
			>
				{title}
			</Typography>
		);
	};

	renderFeatureMarker = ({ feature }) => {
		const {
			viewport: { zoom },
		} = this.state;
		const {
			classes,
			locationsByFeature = {},
			activities = {},
		} = this.props;

		const lowerName = feature.name.toLowerCase();

		if (!feature || !feature.name) {
			return null;
		}

		let icon = <MarkerIcon size={20} />;

		const linkedLocation = locationsByFeature.hasOwnProperty(lowerName)
			? locationsByFeature[lowerName]
			: false;
		const linkedActivity = activities.hasOwnProperty(feature.activityId)
			? activities[feature.activityId]
			: false;

		if (linkedLocation) {
			icon = (
				<img height="30" src={linkedLocation.icon} alt={feature.name} />
			);
		}

		if (linkedActivity) {
			const image =
				linkedActivity.images.thumbnail || linkedActivity.images.medium;

			icon = <Avatar src={image.sourceUrl} className={classes.avatar} />;
		}

		if (feature.icon && IconMap.hasOwnProperty(feature.icon)) {
			console.log(`gotcha ${feature.icon}`);
			let theIcon = IconMap[feature.icon];
			icon = <Avatar className={classes.avatar}>{theIcon}</Avatar>;
		}

		return (
			<Marker
				key={`marker-${feature.name.toLowerCase()}`}
				{...feature.coordinates}
			>
				<MuiLink
					color="primary"
					underline="none"
					className={classes.markerLink}
					onClick={() => {
						this.handleMarkerClick(feature);
					}}
				>
					{icon}
					{zoom > 18 && (
						<Typography
							className={classes.markerText}
							variant="body1"
							component="span"
						>
							{feature.name}
						</Typography>
					)}
				</MuiLink>
			</Marker>
		);
	};

	renderFeatureMarkers = ({ features }) => {
		return features.map((feature) => (
			<this.renderFeatureMarker key={feature.key} feature={feature} />
		));
	};

	render() {
		const { features } = this.props;

		return (
			<MapGL
				width="100%"
				height="100%"
				{...this.state.viewport}
				{...this.state.settings}
				onViewportChange={(viewport) =>
					this._onViewportChange(viewport)
				}
			>
				{this.renderFeatureMarkers({
					clickHandler: this.handleMarkerClick,
					features: features,
				})}
				<Filter key="filters" />
				<GeolocateControl
					key="locationTracker"
					style={geolocateStyle}
					//onViewportChange={this._onViewportChange}
					positionOptions={{ enableHighAccuracy: true }}
					trackUserLocation={true}
					showUserLocation={true}
					fitBoundsOptions={{ maxZoom: 20 }}
				/>
				{this._renderPopup()}
			</MapGL>
		);
	}
}

const mapStateToProps = (state) => {
	const filteredFeatures = getFilteredFeatures(state);
	const locationsByFeature = getLocationsByFeature(state);
	const activities = getActivities(state);

	return {
		features: filteredFeatures,
		locationsByFeature,
		activities,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Floorplan));
