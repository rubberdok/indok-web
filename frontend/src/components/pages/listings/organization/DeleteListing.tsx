import { useMutation } from "@apollo/client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
} from "@mui/material";

import { DeleteListingDocument, OrgAdminListingFragment } from "@/generated/graphql";

type Props = {
  /** Listing to delete (if undefined: hides the dialog) */
  listing: OrgAdminListingFragment | undefined;
  /** Function to call when the dialog is closed */
  onClose: () => void;
};

/** Component for confirmation dialog when an organization admin tries to delete a listing. */
export const DeleteListing: React.FC<Props> = ({ listing, onClose }) => {
  const [deleteListing] = useMutation(DeleteListingDocument, {
    // updates the cache upon deleting the listing, so changes are reflected instantly
    update: (cache, { data }) => {
      if (data?.deleteListing?.listingId) {
        cache.evict({ id: `ListingType:${data.deleteListing.listingId}` });
        cache.gc();
      }
    },
  });

  return (
    <Dialog open={listing !== undefined} onClose={onClose} fullWidth>
      {listing && (
        <>
          <DialogTitle>Slett verv</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Er du sikker på at du vil slette vervet <b>{listing.title}</b>?
            </DialogContentText>
            <FormHelperText error>Dette vil også slette alle søknader du har fått på vervet.</FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              Avbryt
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteListing({ variables: { id: listing.id } });
                onClose();
              }}
            >
              Slett verv
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
