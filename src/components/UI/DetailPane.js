import { Typography } from "@material-ui/core";
import React from "react";

export const DetailPane = ({ content }) => (
	<div className="clearfix">
		<Typography
			variant="body1"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	</div>
);
