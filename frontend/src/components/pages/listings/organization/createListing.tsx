import { useState } from "react";
import { Listing } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { useMutation } from "@apollo/client";
import {
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Grid,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";

interface CreateListingVariables {
  title: string;
  description: string;
  deadline: string;
}

// empty createListing variables for initializing and resetting state
const emptyListing: CreateListingVariables = {
  title: "",
  description: "",
  deadline: "",
};

/* 
component for authorized organization members to create new listings
props:
- the organization for which to create the listing
- the "open" boolean for whether to show the dialog
- "onClose" function to execute when the dialog is closed
 */
const CreateListing: React.FC<{
  organization: Organization;
  open: boolean;
  onClose: () => void;
}> = ({ organization, open, onClose }) => {
  // state to manage the new listing before posting
  const [listing, setListing] = useState<CreateListingVariables>(emptyListing);

  // state to show error on incomplete input
  const [invalidError, showInvalidError] = useState(false);

  // mutation to create the new listing, and update the cache to show it instantly
  const [createListing] = useMutation<{ createListing: { listing: Listing } }>(CREATE_LISTING, {
    // updates the cache upon creating the listing, so it can show up instantly
    update: (cache, { data }) => {
      const newListing = data?.createListing.listing;
      const cachedOrg = cache.readQuery<{ org: Organization }>({
        query: GET_ORGANIZATION,
        variables: { orgId: parseInt(organization.id) },
      });
      if (cachedOrg && newListing) {
        cache.writeQuery({
          query: GET_ORGANIZATION,
          variables: { orgId: parseInt(organization.id) },
          data: {
            organization: {
              listings: [...(cachedOrg.org.listings ?? []), newListing],
            },
          },
        });
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <DialogTitle>Opprett nytt verv for {organization.name}</DialogTitle>
        <Grid container direction="column">
          <InputLabel>Tittel på vervet:</InputLabel>
          <TextField onChange={(e) => setListing({ ...listing, title: e.target.value })} />
          <InputLabel>Beskrivelse:</InputLabel>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            onChange={(e) => setListing({ ...listing, description: e.target.value })}
          />
          <InputLabel>Søknadsfrist:</InputLabel>
          <TextField type="datetime-local" onChange={(e) => setListing({ ...listing, deadline: e.target.value })} />
        </Grid>
        {invalidError && <FormHelperText error>Du må fylle inn alle felter.</FormHelperText>}
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (listing.title && listing.description && listing.deadline) {
                createListing({
                  variables: {
                    title: listing.title,
                    description: listing.description,
                    deadline: listing.deadline,
                    organizationId: organization.id,
                  },
                });
                setListing(emptyListing);
                showInvalidError(false);
                onClose();
              } else {
                showInvalidError(true);
              }
            }}
          >
            Legg til verv
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Avbryt
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListing;
