import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { Form, Response } from "@interfaces/forms";
import { LISTING_RESPONSES } from "@graphql/listings/queries";
import { LISTING_RESPONSES_FRAGMENT } from "@graphql/listings/fragments";
import Link from "next/link";
import Layout from "@components/Layout";
import { makeStyles, Grid, Tabs, Tab, Container, Card, CardContent, Button, Typography, Box } from "@material-ui/core";
import { useState } from "react";
import FormResponse from "@components/forms/formAdmin/FormResponse";
import OrganizationListing from "@components/pages/listings/organization/OrganizationListing";
import { ArrowBack } from "@material-ui/icons";
import { CREATE_FORM } from "@graphql/forms/mutations";
import EditForm from "@components/forms/formAdmin/EditForm";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * page for organization admins to administer a listing, edit its application form, and review applicants
 */
const ListingAdminPage: NextPage = () => {
  const { orgId, listingId } = useRouter().query;

  const classes = useStyles();

  // state to determine whether to show the response or the listing/form view
  const [selectedView, selectView] = useState<Response | "listing">("listing");

  // fetches the listing along with all users who have applied to it, using URL parameter as argument
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING_RESPONSES, {
    variables: {
      id: listingId as string,
    },
  });

  // mutation to create a new form
  const [createForm] = useMutation<
    // interface of formData returned from mutation
    { createForm: { ok: boolean; form: Form } },
    // interface for variables passed to createForm
    { name: string; description: string; listingId: string }
  >(CREATE_FORM, {
    // updates the cache so the new form can show instantly
    update: (cache, { data }) => {
      // gets the new form from the mutation's return
      const newForm = data?.createForm.form;
      // reads the cached listing to which to add the form
      const cachedListing = cache.readFragment<Listing>({
        id: `ListingType:${listingId as string}`,
        fragment: LISTING_RESPONSES_FRAGMENT,
        fragmentName: "ListingResponsesFragment",
      });
      if (newForm && cachedListing) {
        // writes the form to the cached listing
        cache.writeFragment({
          id: `ListingType:${listingId as string}`,
          fragment: LISTING_RESPONSES_FRAGMENT,
          fragmentName: "ListingResponsesFragment",
          data: {
            form: newForm,
          },
        });
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders an overview of applicants, and either an applicant's application or the listing itself (along with its form, or a button to create one)
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
              {data?.listing.form?.responses && (
                <Grid item>
                  <Card>
                    {data.listing.form.responses.length > 0 ? (
                      <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={selectedView}
                        onChange={(_, view) => {
                          selectView(view);
                        }}
                      >
                        <Tab value={"listing"} label="Verv & søknad" />
                        <Box textAlign="center">
                          <Typography variant="h5">Søkere</Typography>
                        </Box>
                        {data.listing.form.responses.map((response, index) => (
                          <Tab
                            key={index}
                            value={response}
                            label={`${response.respondent.firstName} ${response.respondent.lastName}`}
                          />
                        ))}
                      </Tabs>
                    ) : (
                      <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={selectedView}
                        onChange={(_, view) => {
                          selectView(view);
                        }}
                      >
                        <Tab value={"listing"} label="Verv & søknad" />
                        <Box textAlign="center">
                          <Typography variant="h5">Søkere</Typography>
                        </Box>
                        <CardContent>
                          <Typography>Ingen søkere enda.</Typography>
                        </CardContent>
                      </Tabs>
                    )}
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>
          {data && (
            <Grid item xs={8}>
              {selectedView === "listing" ? (
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <OrganizationListing listing={data.listing} />
                  </Grid>
                  <Grid item>
                    {data.listing.form ? (
                      <EditForm form={data.listing.form} />
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          createForm({
                            variables: {
                              name: `Søknad: ${data.listing.title}`,
                              description: "",
                              listingId: data.listing.id,
                            },
                          });
                        }}
                      >
                        Lag søknad
                      </Button>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <>{data.listing.form && <FormResponse response={selectedView} form={data.listing.form} />}</>
              )}
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default ListingAdminPage;
