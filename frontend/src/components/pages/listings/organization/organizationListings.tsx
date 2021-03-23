import { Organization } from "@interfaces/organizations";
import CreateListing from "@components/pages/listings/organization/createListing";
import DeleteListing from "@components/pages/listings/organization/deleteListing";
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
  // state for whether to show the CreateListing dialog
  const [createListingOpen, openCreateListing] = useState(false);

  // state for whether to show the DeleteListing confirmation dialog
  // if not null, contains the listing to be deleted for use by the dialog
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);

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
      <DeleteListing
        listing={confirmDelete}
        organizationId={parseInt(organization.id)}
        onClose={() => {
          setConfirmDelete(null);
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
                                  setConfirmDelete(listing);
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
