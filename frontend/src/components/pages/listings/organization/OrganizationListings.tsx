import { Organization } from "@interfaces/organizations";
import CreateListing from "@components/pages/listings/organization/CreateListing";
import DeleteListing from "@components/pages/listings/organization/DeleteListing";
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
import { Delete, Add } from "@material-ui/icons";

// cursor style on hovering over a listing
const useStyles = makeStyles(() => ({
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

/**
 * component to show a list of listings connected to an organization for its administrators
 * props: the organization for which to show listings
 */
const OrganizationListings: React.FC<{
  organization: Organization;
}> = ({ organization }) => {
  // state for whether to show the CreateListing dialog
  const [createListingShown, showCreateListing] = useState(false);

  // state for whether to show the DeleteListing confirmation dialog
  // if not undefined, contains the listing to be deleted for use by the dialog
  const [listingToDelete, setListingToDelete] = useState<Listing | undefined>();

  const classes = useStyles();

  return (
    <>
      <CreateListing
        organization={organization}
        open={createListingShown}
        onClose={() => {
          showCreateListing(false);
        }}
      />
      <DeleteListing
        listing={listingToDelete}
        organizationId={parseInt(organization.id)}
        onClose={() => {
          setListingToDelete(undefined);
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
                            <TableCell size="small" align="right">
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Delete />}
                                onClick={() => {
                                  setListingToDelete(listing);
                                }}
                              >
                                Slett
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
                startIcon={<Add />}
                onClick={() => {
                  showCreateListing(true);
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
