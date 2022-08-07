import React from "react";
import Page from "../components/UI/Page";
import { Button, CardActions, Grid, Link, Typography } from "@material-ui/core";
import CardBlock from "../components/UI/CardBlock";
import FavoriteIcon from "@material-ui/icons/Favorite";
import partners from "../config/partners.json";

const partnersplus8 = partners.filter(o => o.label != "8 bit")
const partners8 = partners.filter(o => o.label == "8 bit")

const Partners = () => (
	<Page backLink={true} pageTitle={"Partners"}>
		<Grid container spacing={24}>
			{partnersplus8.map((partnerGroup, groupIndex) => (
				<Grid item xs={12} key={groupIndex}>
					<CardBlock
						raw={true}
						header={{
							title: partnerGroup.label,
							titleTypographyProps: { variant: "h3" },
							style: { paddingBottom: 0 },
						}}
					>
						<Grid container spacing={24}>
							{partnerGroup.partners.map(
								(
									{
										alt: title,
										url,
										img,
										desc: { nl: nlDesc, en: enDesc } = {
											nl: "",
											en: "",
										},
									},
									partnerIndex
								) => (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										key={partnerIndex}
									>
										<CardBlock
											raw={true}
											header={{
												title: title,
												titleTypographyProps: {
													variant: "h3",
												},
												style: { paddingBottom: 0 },
											}}
											media={`https://fri3d.be/img/partners/${img}`}
										>
											<Typography
												variant="body1"
												component={"div"}
											>
												{nlDesc || enDesc || ""}

											</Typography>
											<CardActions>
												<Button
													variant="contained"
													component="a"
													target="_blank"
													rel="noreferrer noopener"
													href={url}
													size="small"
													color="primary"
												>
													Website bezoeken
												</Button>
											</CardActions>
										</CardBlock>
									</Grid>
								)
							)}
						</Grid>
					</CardBlock>
				</Grid>
			))}
		</Grid>
        <Grid container spacing={24}>
			{partners8.map((partnerGroup, groupIndex) => (
				<Grid item xs={12} key={groupIndex}>
					<CardBlock
						raw={true}
						header={{
							title: partnerGroup.label,
							titleTypographyProps: { variant: "h3" },
							style: { paddingBottom: 0 },
						}}
					>
						<Grid container spacing={24}>
							{partnerGroup.partners.map(
								(
									{
										alt: title,
										url,
										img,
									},
									partnerIndex
								) => (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										key={partnerIndex}
									>
                                        <a href={url} style={{
                                            display: "block",
                                        }}><img style={{
                                        maxWidth : "100%",
                                        height: "100px",
                                        }} src={`https://fri3d.be/img/partners/${img}`} alt={title} /></a>
									</Grid>
								)
							)}
						</Grid>
					</CardBlock>
				</Grid>
			))}
		</Grid>
	</Page>
);

export default Partners;
