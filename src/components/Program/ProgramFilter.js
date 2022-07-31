import React, { Component, Fragment } from "react";
import Fab from "@material-ui/core/Fab";
import Select from "react-select";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Cancel as CancelIcon } from "@material-ui/icons";
import FaceIcon from "@material-ui/icons/Face";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import {
	DialogTitle,
	Dialog,
	Typography,
	withStyles,
	Paper,
	TextField,
	MenuItem,
	Chip,
	DialogContent,
	Avatar,
	Button,
	Badge,
} from "@material-ui/core";
import { locations } from "../../config/locations";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import DialogActions from "@material-ui/core/DialogActions";

const fabStyle = {
	zIndex: 1000,
	position: "fixed",
	right: "32px",
	top: "88px",
};

const suggestions = locations.map((location) => ({
	value: location.name,
	label: location.name,
}));

const chipFilters = [
	{
		key: "continuous",
		label: "Doorlopend",
		icon: AutorenewIcon,
		property: "continuous",
	},
	{
		key: "childFriendly",
		label: "Kindvriendelijk",
		icon: FaceIcon,
		property: "childFriendly",
	},
	{
		key: "night",
		label: "Avond",
		icon: Brightness2Icon,
		property: "night",
	},
];

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		height: 250,
	},
	input: {
		display: "flex",
		padding: 0,
	},
	filterContainer: {
		marginBottom: `${theme.spacing.unit * 4}px`,
	},
	valueContainer: {
		display: "flex",
		flexWrap: "wrap",
		flex: 1,
		alignItems: "center",
		overflow: "hidden",
	},
	chip: {
		margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
	},
	inActiveChip: {
		textDecoration: "line-through",
	},
	chipFocused: {
		backgroundColor: emphasize(
			theme.palette.type === "light"
				? theme.palette.grey[300]
				: theme.palette.grey[700],
			0.08
		),
	},
	noOptionsMessage: {
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
	},
	singleValue: {
		fontSize: 16,
	},
	placeholder: {
		position: "absolute",
		left: 2,
		fontSize: 16,
	},
	paper: {
		position: "absolute",
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
	},
	divider: {
		height: theme.spacing.unit * 2,
	},
});

function NoOptionsMessage(props) {
	return (
		<Typography
			color="textSecondary"
			className={props.selectProps.classes.noOptionsMessage}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

function inputComponent({ inputRef, ...props }) {
	return <div ref={inputRef} {...props} />;
}

function Control(props) {
	return (
		<TextField
			fullWidth
			InputProps={{
				inputComponent,
				inputProps: {
					className: props.selectProps.classes.input,
					inputRef: props.innerRef,
					children: props.children,
					...props.innerProps,
				},
			}}
			{...props.selectProps.textFieldProps}
		/>
	);
}

function Option(props) {
	return (
		<MenuItem
			buttonRef={props.innerRef}
			selected={props.isFocused}
			component="div"
			style={{
				fontWeight: props.isSelected ? 500 : 400,
			}}
			{...props.innerProps}
		>
			{props.children}
		</MenuItem>
	);
}

function Placeholder(props) {
	return (
		<Typography
			color="textSecondary"
			className={props.selectProps.classes.placeholder}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

function SingleValue(props) {
	return (
		<Typography
			className={props.selectProps.classes.singleValue}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

function ValueContainer(props) {
	return (
		<div className={props.selectProps.classes.valueContainer}>
			{props.children}
		</div>
	);
}

function MultiValue(props) {
	return (
		<Chip
			tabIndex={-1}
			label={props.children}
			className={classNames(props.selectProps.classes.chip, {
				[props.selectProps.classes.chipFocused]: props.isFocused,
			})}
			onDelete={props.removeProps.onClick}
			deleteIcon={<CancelIcon {...props.removeProps} />}
		/>
	);
}

function Menu(props) {
	return (
		<Paper
			square
			className={props.selectProps.classes.paper}
			{...props.innerProps}
		>
			{props.children}
		</Paper>
	);
}

const components = {
	Control,
	Menu,
	MultiValue,
	NoOptionsMessage,
	Option,
	Placeholder,
	SingleValue,
	ValueContainer,
};

class ProgramFilter extends Component {
	state = {
		dialogOpen: false,
		locations: null,
		chipFilters: [],
	};

	handleClose = () => {
		this.setState({ dialogOpen: false });
	};

	handleClickOpen = () => {
		this.setState({
			dialogOpen: true,
		});
	};

	handleChange = (value) => {
		this.setState({
			locations: value,
		});
	};

	componentDidUpdate(prevProps) {
		if (prevProps.filter.categories !== this.props.filter.categories) {
			this.setState({ chipFilters: this.getChipFilters() });
		}
	}

	componentDidMount() {
		this.setState({ chipFilters: this.getChipFilters() });
	}

	getChipFilters() {
		const { filter } = this.props;

		return chipFilters.map((chipFilter) => {
			let chipValue = getChipValue(filter, chipFilter);

			return {
				...chipFilter,
				inUse: chipValue !== undefined,
				activeState:
					chipValue === undefined ? false : chipValue.activeState,
			};
		});
	}

	toggleActiveState(chipFilterKey) {
		this.setState((oldState) => {
			const chipFilters = oldState.chipFilters.map((chipFilter) => {
				let { key, inUse, activeState, ...others } = chipFilter;

				if (chipFilterKey === key) {
					if (!inUse) {
						inUse = true;
						activeState = false;
					}

					activeState = !activeState;
				}

				return { ...others, key, inUse, activeState };
			});

			return { chipFilters };
		});
	}

	toggleInUseState(chipFilterKey) {
		this.setState((oldState) => {
			const chipFilters = oldState.chipFilters.map((chipFilter) => {
				let { key, inUse, ...others } = chipFilter;

				if (chipFilterKey === key) {
					inUse = !inUse;
				}

				return { inUse: inUse, key, ...others };
			});

			return { chipFilters };
		});
	}

	saveFilters() {
		this.handleClose();
		let categories = this.state.chipFilters.filter(
			(chipFilter) => chipFilter.inUse
		);
		let locations = this.state.locations
			? this.state.locations.map((location) => location.value)
			: [];

		this.props.onChange({ categories, locations });
	}

	clearFilters() {
		this.handleClose();
		let categories = [];
		let locations = [];

		this.props.onChange({ categories, locations });
	}

	renderChipFilters() {
		const { classes } = this.props;

		return this.state.chipFilters.map((chipFilter) => {
			let props = {
				color: chipFilter.inUse ? "primary" : "default",
				variant:
					chipFilter.inUse && chipFilter.activeState
						? "default"
						: "outlined",
			};

			let chipClasses = [classes.chip];

			if (chipFilter.inUse) {
				props.deleteIcon = <CancelIcon />;
				props.onDelete = () => this.toggleInUseState(chipFilter.key);

				if (chipFilter.activeState === false) {
					chipClasses.push(classes.inActiveChip);
				}
			}

			return (
				<Chip
					key={chipFilter.key}
					avatar={
						<Avatar>
							<chipFilter.icon />
						</Avatar>
					}
					label={chipFilter.label}
					clickable
					className={`${chipClasses.join(" ")}`}
					onClick={() => this.toggleActiveState(chipFilter.key)}
					{...props}
				/>
			);
		});
	}

	renderDialog() {
		const { classes, theme } = this.props;

		const selectStyles = {
			input: (base) => ({
				...base,
				color: theme.palette.text.primary,
				"& input": {
					font: "inherit",
				},
			}),
		};

		return (
			<Dialog
				fullWidth={true}
				maxWidth={"sm"}
				onClose={this.handleClose}
				open={this.state.dialogOpen}
				aria-labelledby="filter-dialog-title"
			>
				<DialogTitle id="filter-dialog-title">
					Activiteiten verfijnen
				</DialogTitle>
				<DialogContent>
					<div className={classes.filterContainer}>
						<Typography variant="h6">Locatie</Typography>
						<Select
							classes={classes}
							styles={selectStyles}
							textFieldProps={{
								label: "Locaties",
								InputLabelProps: {
									shrink: true,
								},
							}}
							options={suggestions}
							components={components}
							value={this.state.locations}
							onChange={this.handleChange}
							placeholder="Filter op locatie"
							isMulti
						/>
					</div>
					<div className={classes.filterContainer}>
						<Typography variant="h6">Categorieën</Typography>
						<Typography
							style={{ marginBottom: "16px" }}
							variant="body1"
						>
							Duid de categorie aan waarop je wil filteren.
						</Typography>
						<div>{this.renderChipFilters()}</div>
					</div>
					<div></div>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => this.clearFilters()} color="primary">
						Wis filters
					</Button>
					<Button
						variant="contained"
						onClick={() => this.saveFilters()}
						color="primary"
					>
						Filter programma
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	render() {
		const { filter } = this.props;

		let numFilter = filter.categories.length + filter.locations.length;

		let content = <FilterListIcon />;

		if (numFilter > 0) {
			content = (
				<Badge badgeContent={numFilter} color="primary">
					<FilterListIcon />
				</Badge>
			);
		}

		return (
			<Fragment>
				<Fab
					size="medium"
					style={fabStyle}
					onClick={this.handleClickOpen}
					color="secondary"
					aria-label="Filter"
				>
					{content}
				</Fab>
				{this.renderDialog()}
			</Fragment>
		);
	}
}

const getChipValue = (filter, chipFilter) => {
	return filter.categories.find(
		(category) => chipFilter.key === category.key
	);
};

export default withStyles(styles, { withTheme: true })(ProgramFilter);
