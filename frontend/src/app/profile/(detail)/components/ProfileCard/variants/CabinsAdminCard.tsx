import { Badge, Button, CardActions, Grid, Typography } from "@mui/material";

import Cabin from "~/public/illustrations/Cabin.svg";

import { NextLinkComposed } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { ProfileCardBase } from "./ProfileCardBase";

const CabinAdminQueryFragment = graphql(`
  fragment CabinsAdminCard_Query on Query {
    bookings(data: { status: PENDING }) {
      total
      bookings {
        id
        status
      }
    }
  }
`);

type Props = {
  query: FragmentType<typeof CabinAdminQueryFragment>;
};

function CabinsAdminCard({ query, ...props }: Props) {
  const data = getFragmentData(CabinAdminQueryFragment, query);

  return (
    <>
      <ProfileCardBase
        title="Administrer Indøkhyttene"
        actions={
          <CardActions>
            <Badge badgeContent={data.bookings.total} color="error">
              <Button component={NextLinkComposed} to="/cabins/admin" color="secondary">
                Administrer
              </Button>
            </Badge>
          </CardActions>
        }
        image={Cabin}
        alt=""
        {...props}
      >
        <Grid container direction="column">
          <Grid item>
            <Typography variant="body2">
              Her kan du administere innstillinger for hyttene, og behandle søknader
            </Typography>
          </Grid>
        </Grid>
      </ProfileCardBase>
    </>
  );
}

export { CabinsAdminCard };
