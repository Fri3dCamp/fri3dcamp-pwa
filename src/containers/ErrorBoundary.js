import React from "react";
import Error from "./Error";
import { connect } from "react-redux";
import { handleException } from "../redux/actions";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		console.error(error, info);
		this.props.handleException(error, info);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <Error />;
		}

		return this.props.children;
	}
}

export default connect(null, { handleException })(ErrorBoundary);
