import { useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  FormHelperText,
} from "@mui/material";

import WarningButton from "@/components/ui/WarningButton";
import { AdminOrganizationDocument, OrgAdminListingFragment } from "@/generated/graphql";
import { DELETE_LISTING } from "@/graphql/listings/mutations";

type Props = {
  /** Listing to delete (if undefined: hides the dialog) */
  listing: OrgAdminListingFragment | undefined;
  /** ID of the organization that owns the listing (to update cache) */
  organizationId: string;
  /** Called when the dialog is closed */
  onClose: () => void;
};

/** Component for confirmation dialog when an organization admin tries to delete a listing. */
const DeleteListing: React.FC<Props> = ({ listing, organizationId, onClose }) => {
  // mutation to delete the listing
  const [deleteListing] = useMutation<{ deleteListing: { ok: boolean; listingId: string } }, { id: string }>(
    DELETE_LISTING,
    {
      // updates the cache upon deleting the listing, so changes are reflected instantly
      update: (cache, { data }) => {
        const deletedListingId = data?.deleteListing.listingId;
        // reads the cached organization from which to delete the listing
        const cachedOrg = cache.readQuery({
          query: AdminOrganizationDocument,
          variables: { orgId: organizationId },
        });
        if (data?.deleteListing?.ok && deletedListingId && cachedOrg?.organization) {
          // removes the deleted listing from the cached organization's listings
          cache.writeQuery({
            query: AdminOrganizationDocument,
            variables: { orgId: organizationId },
            data: {
              organization: {
                ...cachedOrg.organization,
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
