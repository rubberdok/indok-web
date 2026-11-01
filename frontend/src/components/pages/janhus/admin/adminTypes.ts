/** Types shared by the JanHus admin pages. Nothing here depends on a component's props. */
import type { JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import type { AdminJanHusBookingsQuery, JanHusBookingRequestsQuery } from "@/generated/graphql";

import type { PickedUser } from "./UserPicker";

export type AdminArea = {
  id: string;
  name: string;
  isActive: boolean;
  conflictingAreaIds?: readonly string[] | null;
};

export type AdminBooking = NonNullable<AdminJanHusBookingsQuery["adminJanhusBookings"]>[number];
export type AdminBookingRequest = NonNullable<JanHusBookingRequestsQuery["janhusBookingRequests"]>[number];

export type BookingEdit = {
  startsAt: string;
  endsAt: string;
  area: string;
  status: string;
  eventType: string;
  cleaningRequested: boolean;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  depositStatus: string;
  depositAmount: string;
  priceOverrideTier: string;
  priceOverrideAmount: string;
  manuallyMarkedAsPaid: boolean;
  guestListEntries: JanHusGuestListEntry[];
  doorAccessPolicy: string;
  organizationDoorAccess: string;
  bookerUser: PickedUser | null;
  responsibleUser: PickedUser | null;
  comment: string;
  adminComment: string;
  bookerMessage: string;
};
