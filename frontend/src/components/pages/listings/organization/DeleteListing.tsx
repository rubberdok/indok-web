import { useMutation } from "@apollo/client";
import { DELETE_LISTING } from "@graphql/listings/mutations";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { Organization } from "@interfaces/organizations";
import { Listing } from "@interfaces/listings";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  FormHelperText,
} from "@mui/material";
import WarningButton from "@components/ui/WarningButton";

/**
 * Component for confirmation dialog when an organization admin tries to delete a listing.
 *
 * Props:
 * - the listing to delete (if undefined: hides the dialog)
 * - the id of the organization that owns the listing (for use in the cache update function)
 * - onClose function to execute when the dialog is closed
 */
const DeleteListing: React.FC<{
  listing: Listing | undefined;
  organizationId: number;
  onClose: () => void;
}> = ({ listing, organizationId, onClose }) => {
  // mutation to delete the listing
  const [deleteListing] = useMutation<{ deleteListing: { ok: boolean; listingId: string } }, { id: string }>(
    DELETE_LISTING,
    {
      // updates the cache upon deleting the listing, so changes are reflected instantly
      update: (cache, { data }) => {
        const deletedListingId = data?.deleteListing.listingId;
        // reads the cached organization from which to delete the listing
        const cachedOrg = cache.readQuery<{ organization: Organization }>({
          query: GET_ORGANIZATION,
          variables: { orgId: organizationId },
        });
        if (data?.deleteListing?.ok && deletedListingId && cachedOrg) {
          // removes the deleted listing from the cached organization's listings
          cache.writeQuery({
            query: GET_ORGANIZATION,
            variables: { orgId: organizationId },
            data: {
              organization: {
                listings: (cachedOrg.organization.listings ?? []).filter((listing) => listing.id !== deletedListingId),
              },
            },
          });
        }
      },
    }
  );
  return (
    <Dialog open={listing !== undefined} onClose={onClose} fullWidth>
      {listing && (
        <>
          <DialogContent>
            <DialogTitle>Slett verv</DialogTitle>
            <DialogContentText>
              Er du sikker på at du vil slette vervet <b>{listing.title}</b>?
            </DialogContentText>
            <FormHelperText error>Dette vil også slette alle søknader du har fått på vervet.</FormHelperText>
          </DialogContent>
          <DialogActions>
            <WarningButton
              onClick={() => {
                deleteListing({ variables: { id: listing.id } });
                onClose();
              }}
            >
              Slett verv
            </WarningButton>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              Avbryt
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DeleteListing;
