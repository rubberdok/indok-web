import { useMutation, useQuery } from "@apollo/client";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { Link } from "@/components";
import { EditForm } from "@/components/pages/forms/formAdmin/EditForm";
import { FormResponse } from "@/components/pages/forms/formAdmin/FormResponse";
import { OrganizationListing } from "@/components/pages/listings/organization/OrganizationListing";
import {
  CreateFormDocument,
  FormWithAllResponsesFragmentDoc,
  ListingWithResponsesDocument,
  ResponseFragment,
} from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

/** Page for organization admins to administer a listing, edit its application form, and review applicants. */
const ListingAdminPage: NextPageWithLayout = () => {
  const { orgId, listingId } = useRouter().query;

  // state to determine whether to show the response or the listing/form view
  const [selectedView, selectView] = useState<ResponseFragment | "listing">("listing");

  // fetches the listing along with all users who have applied to it, using URL parameter as argument
  const { loading, error, data } = useQuery(ListingWithResponsesDocument, {
    variables: { id: listingId as string },
    skip: !listingId,
  });

  // mutation to create a new form
  const [createForm] = useMutation(CreateFormDocument, {
    // updates the cache so the new form can show instantly
    update: (cache, { data }) => {
      const newForm = data?.createForm?.form;
      if (newForm) {
        cache.modify({
          id: `ListingType:${listingId}`,
          fields: {
            form(_, { INVALIDATE }) {
              const newRef = cache.writeFragment({
                data: newForm,
                fragment: FormWithAllResponsesFragmentDoc,
                fragmentName: "FormWithAllResponses",
              });
              if (newRef) return newRef;
              return INVALIDATE;
            },
          },
        });
      }
    },
  });

  const onCreateFormClick = () => {
    const listing = data?.listing;
    if (listing) {
      createForm({
        variables: {
          formData: { name: `Søknad: ${listing.title}`, description: "", organizationId: orgId as string },
          listingId: listing.id,
        },
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  // renders an overview of applicants, and either an applicant's application or the listing itself
  // (along with its form, or a button to create one)
  return (
    <Container>
      <Grid container direction="row" justifyContent="center" spacing={1}>
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Button
                component={Link}
                href={`/orgs/${orgId}`}
                noLinkStyle
                fullWidth
                variant="contained"
                startIcon={<ArrowBack />}
              >
                Tilbake
              </Button>
            </Grid>
            {data?.listing?.form?.responses && (
              <Grid item>
                <Card>
                  {data.listing.form.responses.length > 0 ? (
                    <Tabs
                      color="primary"
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
        {data?.listing && (
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
                    <Button fullWidth variant="contained" color="primary" onClick={onCreateFormClick}>
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
  );
};

ListingAdminPage.getLayout = (page) => (
  <Layout>
    <RootStyle> {page}</RootStyle>
  </Layout>
);

export default ListingAdminPage;
