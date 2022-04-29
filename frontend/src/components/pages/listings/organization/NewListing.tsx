import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import ListingForm from "@components/pages/listings/organization/ListingForm";
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { USER_WITH_ORGANIZATIONS } from "@graphql/listings/queries";
import { Listing, ListingInput } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import { Container, Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}));

const emptyListing: ListingInput = {
  id: "",
  description: "",
  title: "",
  startDatetime: "",
  deadline: "",
  applicationUrl: "",
  organization: {
    name: "",
    id: "",
    color: "",
    description: "",
    slug: "",
  },
};

/**
 * Page for creating new listings, navigates to the newly created listing upon completion.
 */
const NewListing: React.FC<{
  defaultOrganizationId?: string;
}> = ({ defaultOrganizationId }) => {
  const classes = useStyles();

  const router = useRouter();

  // state to manage the listing being created
  const [listing, setListing] = useState<ListingInput>(emptyListing);

  /**
   * Load the organizations to which the user belongs.
   * @todo Currently assumes the user belongs to an organization, which must be the case, yet this should allow for dynamically setting the default organization.
   */
  const { loading, error, data } = useQuery<{ user: { organizations: Organization[] } }>(USER_WITH_ORGANIZATIONS, {
    onCompleted: (data) =>
      setListing({
        ...listing,
        organization:
          data.user.organizations.find((organization) => organization.id === defaultOrganizationId) ||
          data.user.organizations[0],
      }),
  });

  // Create the listing, navigate to the newly created listing upon completion.
  const [createListing] = useMutation<{ createListing: { ok: boolean; listing: Listing } }>(CREATE_LISTING, {
    onCompleted: (data) => router.push(`/orgs/${listing.organization.id}/listings/${data.createListing.listing.id}`),
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  return (
    <Layout>
      <Container className={classes.root}>
        <Typography variant="h1" gutterBottom>
          Ny vervutlysning
        </Typography>
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            <ListingForm
              listing={listing}
              setListing={setListing}
              organizations={data?.user.organizations || []}
              onSubmit={() => {
                createListing({
                  variables: {
                    input: {
                      title: listing.title,
                      description: listing.description || undefined,
                      startDatetime: listing.startDatetime || undefined,
                      deadline: listing.deadline,
                      organizationId: listing.organization?.id,
                      case: listing.case || undefined,
                      interview: listing.interview || undefined,
                      application: listing.application || undefined,
                      applicationUrl: listing.applicationUrl || undefined,
                      readMoreUrl: listing.readMoreUrl || undefined,
                    },
                  },
                });
              }}
              onCancel={() => router.back()}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};
export default NewListing;
