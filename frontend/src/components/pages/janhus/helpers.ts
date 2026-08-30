import { JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import dayjs from "@/lib/date";

import { MANUAL_ENTRY_PREFIX, OwnerType } from "./constants";

export const toDateKey = (isoDate: string) => dayjs(isoDate).format("YYYY-MM-DD");
export const formatDate = (isoDate: string) => dayjs(isoDate).format("DD.MM.YYYY");
export const formatTime = (isoDate: string) => dayjs(isoDate).format("HH:mm");
export const toDateTimeInput = (isoDate: string) => dayjs(isoDate).format("YYYY-MM-DDTHH:mm");

export const statusChipColor = (status: string): "default" | "success" | "warning" | "error" | "info" => {
  if (status === "CONFIRMED" || status === "APPROVED") {
    return "success";
  }
  if (status === "PENDING_ADMIN_REVIEW" || status === "PENDING" || status === "PROVISIONAL") {
    return "warning";
  }
  if (status === "DECLINED" || status === "REJECTED" || status === "CANCELLED") {
    return "error";
  }
  if (status === "BLOCKED") {
    return "info";
  }
  return "default";
};

export type OverlappingBooking = {
  reference: string;
  startsAt: string;
  endsAt: string;
  area: { name: string };
};

export function describeOverlaps(overlaps: OverlappingBooking[] | null | undefined): string | undefined {
  if (!overlaps?.length) {
    return undefined;
  }

  const details = overlaps
    .map(
      (booking) =>
        `${booking.reference} (${booking.area.name}, ${formatDate(booking.startsAt)} ` +
        `${formatTime(booking.startsAt)}–${formatTime(booking.endsAt)})`
    )
    .join(", ");

  return `Obs: overlapper ${overlaps.length === 1 ? "bookingen" : "bookingene"} ${details}.`;
}

export const serializeGuestListForUpdate = (guests: JanHusGuestListEntry[]) => {
  const normalizedGuests = guests
    .map((guest) => {
      const displayName = guest.displayName.trim();
      const feideUserId = guest.feideUserId.trim();

      if (!displayName) {
        return null;
      }

      const isManualEntry = feideUserId.startsWith(MANUAL_ENTRY_PREFIX) || feideUserId === displayName;
      return isManualEntry ? displayName : feideUserId;
    })
    .filter((value): value is string => Boolean(value));

  return JSON.stringify(normalizedGuests);
};

export const requestOwnerType = (request: {
  ownerOrganization?: { id: string; name: string } | null;
  requesterUser?: { id: string } | null;
}): OwnerType => {
  if (request.ownerOrganization) {
    return "ORGANIZATION";
  }
  if (request.requesterUser) {
    return "PERSONAL";
  }
  return "EXTERNAL";
};

export const bookingOwnerType = (booking: {
  isExternalBooking: boolean;
  ownerOrganization?: { id: string; name: string } | null;
}): OwnerType => {
  if (booking.isExternalBooking) {
    return "EXTERNAL";
  }
  if (booking.ownerOrganization) {
    return "ORGANIZATION";
  }
  return "PERSONAL";
};
