import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTING_WITH_RESPONDERS } from "@graphql/listings/queries";
import Link from "next/link";
import Layout from "@components/Layout";
import { makeStyles, Grid, Tabs, Tab, Container, Card, CardContent, Button, Typography, Box } from "@material-ui/core";
import { useState } from "react";
import { User } from "@interfaces/users";
import FormAnswers from "@components/forms/formAdmin/FormAnswers";
import OrganizationListing from "@components/pages/listings/organization/OrganizationListing";
import { ArrowBack } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

// the page for organization admins to administer a listing, edit its application form, and review applicants
const ListingAdminPage: NextPage = () => {
  const { orgId, listingId } = useRouter().query;

  const classes = useStyles();

  // fetches the listing along with all users who have applied to it, using URL parameter as argument
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING_WITH_RESPONDERS, {
    variables: {
      id: parseInt(listingId as string),
    },
  });

  // state to determine whether to show the applicant view or the listing/form view
  const [selectedApplicant, selectApplicant] = useState<User | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders an overview of applicants, and either an applicant's application or the listing itself (depending on selectedApplicant state)
  return (
    <Layout>
      <Container className={classes.container}>
        <Grid container direction="row" justify="center" spacing={1}>
          <Grid item>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Link href={`/orgs/${orgId}`} passHref>
                  <Button fullWidth variant="contained" startIcon={<ArrowBack />}>
                    Tilbake
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Card>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={selectedApplicant}
                    onChange={(_, applicant) => {
                      selectApplicant(applicant);
                    }}
                  >
                    <Tab value={null} label="Verv & søknad" />
                    <Box textAlign="center">
                      <Typography variant="h5">Søkere</Typography>
                    </Box>
                    {data && (data.listing.form?.responders ?? []).length > 0 ? (
                      <>
                        {data.listing.form?.responders.map((responder, index) => (
                          <Tab key={index} value={responder} label={`${responder.firstName} ${responder.lastName}`} />
                        ))}
                      </>
                    ) : (
                      <CardContent>
                        <Typography>Ingen søkere enda.</Typography>
                      </CardContent>
                    )}
                  </Tabs>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          {data && (
            <Grid item xs={8}>
              {selectedApplicant ? (
                <>
                  {data.listing.form && (
                    <FormAnswers user={selectedApplicant} formId={parseInt(data.listing.form.id)} />
                  )}
                </>
              ) : (
                <OrganizationListing listing={data.listing} />
              )}
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default ListingAdminPage;
