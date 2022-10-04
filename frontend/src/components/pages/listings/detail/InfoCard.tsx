import { OpenInNew } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Link from "next/link";

import { ListingFragment } from "@/generated/graphql";

/**
 * Component for title and organization info on the listing detail page.
 *
 * Props:
 * - the listing to render
 */
const InfoCard: React.FC<{
  listing: ListingFragment;
}> = ({ listing }) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "100%" }}
        >
          <Grid item>
            <Typography
              variant="h5"
              component="h2"
              sx={(theme) => ({
                /* https://stackoverflow.com/a/13924997 */
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                "-webkit-line-clamp": 3 /* number of lines to show */,
                "-webkit-box-orient": "vertical",
                [theme.breakpoints.down("lg")]: {
                  fontSize: theme.typography.h6.fontSize,
                },
              })}
              align="center"
            >
              {listing.organization?.name}
            </Typography>
          </Grid>
          <Grid item>
            {listing.readMoreUrl && (
              <Link passHref href={listing.readMoreUrl}>
                <Button endIcon={<OpenInNew />}>Les mer</Button>
              </Link>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
