import { Listing } from "@interfaces/listings";
import { LISTING_WITH_RESPONDERS } from "@graphql/listings/queries";
import EditForm from "@components/forms/formAdmin/EditForm";
import { Form } from "@interfaces/forms";
import { CREATE_FORM } from "@graphql/forms/mutations";
import { useMutation } from "@apollo/client";
import { Button, Typography, Card, CardContent, Grid } from "@material-ui/core";

/**
 * component for authorized organization members to administer their listing
 * props: the listing to administrate
 */
// TODO: functionality to edit the listing's name/description
const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => {
  // mutation to create a new form
  const [createForm] = useMutation<
    // interface of formData returned from mutation
    { createForm: { ok: boolean; form: Form } },
    // interface for variables passed to createForm
    { name: string; description: string; listingId: string }
  >(CREATE_FORM, {
    // updates the cache so the new form can show instantly
    update: (cache, { data }) => {
      const newForm = data?.createForm.form;
      // reads the cached listing to which to add the form
      const cachedListing = cache.readQuery<{ listing: Listing }>({
        query: LISTING_WITH_RESPONDERS,
        variables: { id: parseInt(listing.id) },
      });
      if (newForm && cachedListing) {
        // writes the form to the cached listing
        cache.writeQuery({
          query: LISTING_WITH_RESPONDERS,
          variables: { id: parseInt(listing.id) },
          data: {
            listing: {
              form: newForm,
            },
          },
        });
      }
    },
  });

  // if the listing has no form, shows create button; otherwise, shows the form
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h3">{listing.title}</Typography>
            <Typography>{listing.description}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {listing.form ? (
        <Grid item>
          <EditForm formId={listing.form.id} />
        </Grid>
      ) : (
        <Grid item>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              createForm({
                variables: {
                  name: `Søknad: ${listing.title}`,
                  description: "",
                  listingId: listing.id,
                },
              });
            }}
          >
            Lag søknad
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default OrganizationListing;
