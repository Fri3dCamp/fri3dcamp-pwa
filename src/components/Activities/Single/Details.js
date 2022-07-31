import React from "react";
import Period from "./Period";
import TodayIcon from "@material-ui/icons/Today";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DetailList from "../../UI/DetailList";
import { capitalize } from "lodash";

let detailsByActivity = (activity, location) => [
	/*{
        key: 'location',
        link: `${process.env.PUBLIC_URL}/map`,
        text: {primary: 'Locatie', secondary: location.name},
        avatar: <LocationOnIcon/>,
      },
      {key: 'div1', isDivider: true},*/
	{
		key: "day",
		text: { primary: "Dag", secondary: capitalize(activity.day) },
		avatar: <TodayIcon />,
	},
	{ key: "div2", isDivider: true },
	{
		key: "period",
		text: { primary: "Periode", secondary: <Period activity={activity} /> },
		avatar: <AccessTimeIcon />,
	},
];

export default ({ activity, location }) => (
	<DetailList>{detailsByActivity(activity, location)}</DetailList>
);
