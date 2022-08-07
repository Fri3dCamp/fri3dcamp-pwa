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
import EuroSymbolIcon from "@material-ui/icons/EuroSymbol";
import InfoIcon from "@material-ui/icons/Info";
import {prefixRoute} from "../../routing";
import { Icon } from "@material-ui/core";
import InfodeskSvg from '../../img/icons/infodesk.svg';
import SanitairSvg from '../../img/icons/sanitair.svg';
import BlokhutSvg from '../../img/icons/blokhut.svg';
import CamperSvg from '../../img/icons/campers.svg';
import EhboSvg from '../../img/icons/ehbo.svg';
import CateringSvg from '../../img/icons/catering.svg';
import BarSvg from '../../img/icons/bar.svg';
import KampvuurSvg from '../../img/icons/kampvuur.svg';
import ParkingSvg from '../../img/icons/parking.svg';
import CampingSvg from '../../img/icons/camping.svg';
import HardwareHackingSvg from '../../img/icons/hardware-hacking.svg';
import ChilloutSvg from '../../img/icons/chillout.svg';
import CircustentSvg from '../../img/icons/circustent.svg';
import KapelSvg from '../../img/icons/kapel.svg';
import KnutselbaarSvg from '../../img/icons/knutselbaar.svg';
import KoelkastSvg from '../../img/icons/koelkast.svg';
import PodiumSvg from '../../img/icons/buitenpodium.svg';
import VillagesSvg from '../../img/icons/villages.svg';
import HoofdgebouwSvg from '../../img/icons/hoofdgebouw.svg';
import ShelterSvg from '../../img/icons/shelter.svg';
import GateSvg from '../../img/icons/gate.svg';

const geolocateStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	margin: 10,
};

const InfodeskIcon = () => (
    <Icon>
        <img src={InfodeskSvg} height={25} width={25}/>
    </Icon>
);
const SanitairIcon = () => (
    <Icon>
        <img src={SanitairSvg} height={25} width={25}/>
    </Icon>
);
const BlokhutIcon = () => (
    <Icon>
        <img src={BlokhutSvg} height={25} width={25}/>
    </Icon>
);
const CamperIcon = () => (
    <Icon>
        <img src={CamperSvg} height={25} width={25}/>
    </Icon>
);
const EhboIcon = () => (
    <Icon>
        <img src={EhboSvg} height={25} width={25}/>
    </Icon>
);
const CateringIcon = () => (
    <Icon>
        <img src={CateringSvg} height={25} width={25}/>
    </Icon>
);
const BarIcon = () => (
    <Icon>
        <img src={BarSvg} height={25} width={25}/>
    </Icon>
);
const KampvuurIcon = () => (
    <Icon>
        <img src={KampvuurSvg} height={25} width={25}/>
    </Icon>
);
const ParkingIcon = () => (
    <Icon>
        <img src={ParkingSvg} height={25} width={25}/>
    </Icon>
);
const CampingIcon = () => (
    <Icon>
        <img src={CampingSvg} height={25} width={25}/>
    </Icon>
);
const HardwareHackingIcon = () => (
    <Icon>
        <img src={HardwareHackingSvg} height={25} width={25}/>
    </Icon>
);
const ChilloutIcon = () => (
    <Icon>
        <img src={ChilloutSvg} height={25} width={25}/>
    </Icon>
);
const CircustentIcon = () => (
    <Icon>
        <img src={CircustentSvg} height={25} width={25}/>
    </Icon>
);
const KapelIcon = () => (
    <Icon>
        <img src={KapelSvg} height={25} width={25}/>
    </Icon>
);
const KnutselbaarIcon = () => (
    <Icon>
        <img src={KnutselbaarSvg} height={25} width={25}/>
    </Icon>
);
const KoelkastIcon = () => (
    <Icon>
        <img src={KoelkastSvg} height={25} width={25}/>
    </Icon>
);
const PodiumIcon = () => (
    <Icon>
        <img src={PodiumSvg} height={25} width={25}/>
    </Icon>
);
const VillagesIcon = () => (
    <Icon>
        <img src={VillagesSvg} height={25} width={25}/>
    </Icon>
);
const HoofdgebouwIcon = () => (
    <Icon>
        <img src={HoofdgebouwSvg} height={25} width={25}/>
    </Icon>
);
const ShelterIcon = () => (
    <Icon>
        <img src={ShelterSvg} height={25} width={25}/>
    </Icon>
);
const GateIcon = () => (
    <Icon>
        <img src={GateSvg} height={25} width={25}/>
    </Icon>
);


const IconMap = {
	restaurant: <CateringIcon />,
	euro: <EuroSymbolIcon />,
	info: <InfoIcon />,
	'ehbo': <EhboIcon />,
	'ehbo post': <EhboIcon />,
	'infodesk' : <InfodeskIcon />,
	'infodesk & noc' : <InfodeskIcon />,
	'blokhut' : <BlokhutIcon />,
	'sanitair grauwe els' : <SanitairIcon />,
	'sanitair tamme kastanje' : <SanitairIcon />,
	'catering' : <CateringIcon />,
	'day bar' : <BarIcon />,
	'parking' : <ParkingIcon />,
	'overflow parking' : <ParkingIcon />,
	'kampvuur' : <KampvuurIcon />,
	'campervans/caravans' : <CamperIcon />,
	'campervans/caravans (overflow)' : <CamperIcon />,
    'camping herfstmale' : <CampingIcon />,
    'grote camping (woudloper, hiker en st-joris)' : <CampingIcon />,
    'camping tamme kastanje' : <CampingIcon />,
    'camping totem' : <CampingIcon />,
    'hardware hacking area' : <HardwareHackingIcon />,
    'chill-out zone' : <ChilloutIcon />,
    'circustent' : <CircustentIcon />,
    'kapel' : <KapelIcon />,
    'knutselbaar' : <KnutselbaarIcon />,
    'ijskasten' : <KoelkastIcon />,
    'buitenpodium' : <PodiumIcon />,
    'villages' : <VillagesIcon />,
    'hoofdgebouw' : <HoofdgebouwIcon />,
    'shelter' : <ShelterIcon />,
    'inkom' : <GateIcon />,
	bar: <BarIcon />,
	wc: <SanitairIcon />,
};

const styles = (theme) => ({
	markerLink: {
		maxWidth: "150px",
		maxHeight: "80px",
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
		color: "#000",
	},
	avatar: {
		width: 40,
		height: 40,
		//background: theme.palette.secondary.main,
		background: "white",
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
			// mapStyle: 'mapbox://styles/mapbox/outdoors-v11',
            mapStyle: 'mapbox://styles/vdwijngaert/cl6hwwcjs006a16pkfbk6qh3h',
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
			popupInfo.locations = locationsByFeature[fName];
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
		} else if (popupInfo.locations) {
            let sublocations = false
            if (popupInfo.locations.length > 1){
                sublocations = true
            }

			content = (
				<>
					{popupInfo.locations.map( (location,index) => <this.renderLocationPopup location={location} index={index} sublocations={sublocations} amount={Math.ceil(3 / popupInfo.locations.length)} />)}
				</>

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

	renderLocationPopup = ({ location, amount = 3, sublocations=false, index=0  }) => {
        if (sublocations) {
            if (0 === index) {
                return (
                    <>
                        <CardActionArea
                            component={Link}
                            to={prefixRoute(`/location/${location.name.toLowerCase()}`)}
                        >
                            <CardHeader
                                title={location.feature}
                                subheader={undefined}
                                titleTypographyProps={{fontSize:'20px'}}
                                avatar={<Avatar src={location.icon} />}
                            />
                            <Typography variant="subtitle1" style={{marginLeft:"16px", fontWeight:"bold"}}>
                                {location.label || location.name}
                            </Typography>
                        </CardActionArea>
                        <UpcomingActivities
                            title=""
                            amount={amount}
                            location={location.name.toLowerCase()}
                        />
                    </>
                );
            } else {

                return (
                    <>
                        <CardActionArea
                            component={Link}
                            to={prefixRoute(`/location/${location.name.toLowerCase()}`)}
                        >
                            <Typography variant="subtitle1" style={{marginLeft:"16px", fontWeight:"bold"}}>
                                {location.label || location.name}
                            </Typography>
                        </CardActionArea>
                        <UpcomingActivities
                            title=""
                            amount={amount}
                            location={location.name.toLowerCase()}
                        />
                    </>
                );
            }
            
        } else {
            return (
			<>
                <CardActionArea
                    component={Link}
                    to={prefixRoute(`/location/${location.name.toLowerCase()}`)}
                >
                    <CardHeader
                        title={location.feature}
                        titleTypographyProps={{fontSize:'20px'}}
                        subheader={undefined}
                        avatar={<Avatar src={location.icon} />}
                    />
                </CardActionArea>
				<UpcomingActivities
					title=""
					amount={amount}
					location={location.name.toLowerCase()}
				/>
			</>
		);
        }
		
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
					to={prefixRoute(`activity/${activity.id}`)}
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
				{/*<Filter key="filters" />*/}
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
