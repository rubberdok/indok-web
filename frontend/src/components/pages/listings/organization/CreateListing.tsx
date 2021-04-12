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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

// variables to pass into the CreateListing mutation
// TODO: replace with graphQL code-gen
interface CreateListingVariables {
  title: string;
  description: string;
  deadline: string;
  case?: boolean;
  interview?: boolean;
  application?: boolean;
}

// empty createListing variables for initializing and resetting state
const emptyListing: CreateListingVariables = {
  title: "",
  description: "",
  deadline: "",
  case: false,
  interview: false,
  application: false,
};

/**
 * component for authorized organization members to create new listings
 * props:
 * - the organization for which to create the listing
 * - the "open" boolean for whether to show the dialog
 * - "onClose" function to execute when the dialog is closed
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

  // mutation to create the new listing
  const [createListing] = useMutation<{ createListing: { ok: boolean; listing: Listing } }>(CREATE_LISTING, {
    // updates the cache upon creating the listing, so it can show up instantly
    update: (cache, { data }) => {
      const newListing = data?.createListing.listing;
      // reads the cached Organization on which the listing should be added
      const cachedOrg = cache.readQuery<{ organization: Organization }>({
        query: GET_ORGANIZATION,
        variables: { orgId: parseInt(organization.id) },
      });
      if (data?.createListing?.ok && newListing && cachedOrg) {
        // writes the new listing to the cached organization's listings
        cache.writeQuery({
          query: GET_ORGANIZATION,
          variables: { orgId: parseInt(organization.id) },
          data: {
            organization: {
              listings: [...(cachedOrg.organization.listings ?? []), newListing],
            },
          },
        });
      }
    },
  });

  // renders a dialog with a form to create a new listing
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
          <FormControl component="fieldset">
            <FormLabel component="legend">Opptaksprosessen</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={listing.application} onChange={(e) => setListing({...listing, application: e.target.checked})} color="primary" />}
                label="Søknad"
              />
              <FormControlLabel
                control={<Checkbox checked={listing.interview} onChange={(e) => setListing({...listing, interview: e.target.checked})} color="primary" />}
                label="Intervju"
              />
              <FormControlLabel
                control={<Checkbox checked={listing.case} onChange={(e) => setListing({...listing, case: e.target.checked})} color="primary" />}
                label="Case"
              />
            </FormGroup>
          </FormControl>
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
                    application: listing.application,
                    interview: listing.interview,
                    case: listing.case,
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
