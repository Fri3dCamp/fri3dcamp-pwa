import React from "react";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import { DetailPane } from "../components/UI/DetailPane";
import { connect } from "react-redux";
import { markAsRead } from "../redux/actions";
import PropTypes from "prop-types";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import Page from "../components/UI/Page";
import { Redirect, withRouter } from "react-router-dom";
import CardBlock from "../components/UI/CardBlock";
import { getUpdateLoader } from "../redux/selectors";
import {prefixRoute} from "../routing";

const styles = (theme) => ({});

class Update extends React.Component {
	static propTypes = {
		updateId: PropTypes.number.isRequired,
		update: PropTypes.object,
		markAsRead: PropTypes.func.isRequired,
	};

	markAsRead() {
		const { update, markAsRead } = this.props;

		if (update && !update.isRead) {
			markAsRead(update.id);
		}
	}

	componentDidMount() {
		this.markAsRead();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { update } = this.props;
		if (update && update.title) {
			document.title = `${update.title} - Fri3d Camp`;
		}

		this.markAsRead();
	}

	renderUpdate = () => {
		const { update } = this.props;
		let img = null;

		if (!update) {
			return <Redirect to={prefixRoute(`/update`)} />;
		}

		if (update && update.images) {
			img =
				update.images.large ||
				update.images.full ||
				update.images.medium;
		}

		return (
			<CardBlock
				media={img && img.sourceUrl}
				mediaProps={{ style: { paddingTop: "56.25%" } }}
				header={{
					title: update.title,
					subheader: moment(update.date).format("LLL"),
					titleTypographyProps: { variant: "h2" },
				}}
				raw={true}
			>
				<DetailPane content={update.content} />
			</CardBlock>
		);
	};

	render() {
		const { needsPreloading } = this.props;

		return (
			<Page backLink pageTitle="" smaller={true}>
				{needsPreloading ? <LoadingIndicator /> : this.renderUpdate()}
			</Page>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const updateId = parseInt(ownProps.match.params.id);

	const {
		entities: { updates },
	} = state;

	const update = updates[updateId];
	const updateLoader = getUpdateLoader(state);
	const needsPreloading = !update && updateLoader.isFetching;

	return {
		update,
		needsPreloading,
	};
};

export default withRouter(
	connect(mapStateToProps, { markAsRead })(withStyles(styles)(Update))
);
