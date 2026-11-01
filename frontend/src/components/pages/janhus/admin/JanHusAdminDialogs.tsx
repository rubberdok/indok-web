import { GuestListDialog, type JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";

import type { AdminBooking } from "./adminTypes";
import { DeleteDialog } from "./DeleteDialog";

function getDeletionDescription(kind: "booking" | "request", isMailed: boolean) {
  if (kind === "request") {
    return "Forespørselen slettes for godt, og bestilleren får ingen e-post. Vil du gi beskjed, bruk «Avvis».";
  }
  if (isMailed) {
    return "Bookingen slettes for godt. Bestilleren og ansvarlig får en e-post om at den er slettet.";
  }
  return "Bookingen slettes for godt. Den er over, avslått eller kansellert, så ingen får e-post.";
}

export type PendingDelete = { kind: "booking" | "request"; id: string };

type JanHusAdminDialogsProps = Readonly<{
  canManage: boolean;
  pendingDelete: PendingDelete | undefined;
  deletionIsMailed: boolean;
  deletingBooking: boolean;
  deletingRequest: boolean;
  activeGuestListBooking: AdminBooking | undefined;
  activeGuestListEntries: JanHusGuestListEntry[];
  bookingUpdating: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: (message: string) => void | Promise<void>;
  onCloseGuestList: () => void;
  onSaveGuestList: (bookingId: string, guests: JanHusGuestListEntry[]) => void;
}>;

export function JanHusAdminDialogs({
  canManage,
  pendingDelete,
  deletionIsMailed,
  deletingBooking,
  deletingRequest,
  activeGuestListBooking,
  activeGuestListEntries,
  bookingUpdating,
  onCancelDelete,
  onConfirmDelete,
  onCloseGuestList,
  onSaveGuestList,
}: JanHusAdminDialogsProps) {
  return (
    <>
      {canManage && pendingDelete ? (
        <DeleteDialog
          key={`${pendingDelete.kind}-${pendingDelete.id}`}
          open
          title={
            pendingDelete.kind === "booking"
              ? `Slette booking #${pendingDelete.id}?`
              : `Slette forespørsel #${pendingDelete.id}?`
          }
          description={getDeletionDescription(pendingDelete.kind, deletionIsMailed)}
          allowMessage={deletionIsMailed}
          deleting={deletingBooking || deletingRequest}
          onCancel={onCancelDelete}
          onConfirm={onConfirmDelete}
        />
      ) : null}

      {canManage && activeGuestListBooking ? (
        <GuestListDialog
          bookingId={activeGuestListBooking.id}
          open
          allowManualEntries
          initialGuests={activeGuestListEntries}
          saving={bookingUpdating}
          onClose={onCloseGuestList}
          onSave={(guests) => onSaveGuestList(activeGuestListBooking.id, guests)}
        />
      ) : null}
    </>
  );
}
