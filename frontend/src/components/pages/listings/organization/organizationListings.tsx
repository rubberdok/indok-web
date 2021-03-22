import { Organization } from "@interfaces/organizations";
import CreateListing from "@components/pages/listings/organization/createListing";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardActions,
  makeStyles,
} from "@material-ui/core";
import { useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Listing } from "@interfaces/listings";
import { useMutation } from "@apollo/client";
import { DELETE_LISTING } from "@graphql/listings/mutations";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";

// cursor style on hovering over a listing
const useStyles = makeStyles(() => ({
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

// component to show a list of listings connected to an organization for its administrators
// props: the organization for which to show listings
const OrganizationListings: React.FC<{
  organization: Organization;
}> = ({ organization }) => {
  // state to determine whether to show the CreateListing dialog
  const [createListingOpen, openCreateListing] = useState(false);

  const [deleteListing] = useMutation<{ ok: boolean; listingId: string }, { id: string }>(DELETE_LISTING, {
    // updates the cache upon deleting the listing, so changes are reflected instantly
    update: (cache, { data }) => {
      const deletedListingId = data?.listingId;
      const cachedOrg = cache.readQuery<{ organization: Organization }>({
        query: GET_ORGANIZATION,
        variables: { orgId: parseInt(organization.id) },
      });
      console.log(deletedListingId);
      console.log(cachedOrg);
      if (cachedOrg && deletedListingId) {
        cache.writeQuery({
          query: GET_ORGANIZATION,
          variables: { orgId: parseInt(organization.id) },
          data: {
            organization: {
              listings: (cachedOrg.organization.listings ?? []).filter((listing) => listing.id !== deletedListingId),
            },
          },
        });
      }
    },
  });

  const classes = useStyles();

  return (
    <>
      <CreateListing
        organization={organization}
        open={createListingOpen}
        onClose={() => {
          openCreateListing(false);
        }}
      />
      <Grid item container>
        <Grid item xs>
          <Card variant="outlined">
            <CardHeader title="Verv" />
            <Divider variant="middle" />
            {organization.listings && organization.listings.length !== 0 && (
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tittel</TableCell>
                        <TableCell>Søknadsfrist</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {organization.listings.map((listing: Listing) => (
                        <Link href={`${organization.id}/listings/${listing.id}`} passHref key={listing.id}>
                          <TableRow className={classes.hover} hover>
                            <TableCell>{listing.title}</TableCell>
                            <TableCell>{dayjs(listing.deadline).format("HH:mm DD-MM-YYYY")}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteListing({
                                    variables: {
                                      id: listing.id,
                                    },
                                  });
                                }}
                              >
                                Slett verv
                              </Button>
                            </TableCell>
                          </TableRow>
                        </Link>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            )}
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  openCreateListing(true);
                }}
              >
                Opprett nytt verv
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default OrganizationListings;
