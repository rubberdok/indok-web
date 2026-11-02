import { toDateTimeInput } from "@/components/pages/janhus/helpers";

import type { AdminBooking, AdminBookingRequest, BookingEdit } from "./adminTypes";

/** A linked website user as the door access pickers show it. */
function pickedUser(user: { id: string; firstName: string; lastName: string } | null | undefined) {
  return user ? { id: user.id, displayName: `${user.firstName} ${user.lastName}`.trim() } : null;
}

export function mergeRequestComments(current: Record<string, string>, requests: readonly AdminBookingRequest[]) {
  const next = { ...current };
  for (const request of requests) {
    next[request.id] ??= request.adminComment || "";
  }
  return next;
}

function bookingEditFrom(booking: AdminBooking): BookingEdit {
  return {
    startsAt: toDateTimeInput(booking.startsAt),
    endsAt: toDateTimeInput(booking.endsAt),
    area: booking.area.id,
    status: booking.status,
    eventType: booking.eventType,
    cleaningRequested: booking.cleaningRequested,
    responsibleName: booking.responsibleName,
    responsibleEmail: booking.responsibleEmail,
    responsiblePhone: booking.responsiblePhone,
    bookerName: booking.bookerName,
    bookerEmail: booking.bookerEmail,
    bookerPhone: booking.bookerPhone,
    depositStatus: booking.depositStatus,
    depositAmount: String(booking.depositAmount ?? 0),
    priceOverrideTier: booking.priceOverrideTier ?? "",
    priceOverrideAmount: booking.priceOverrideAmount != null ? String(booking.priceOverrideAmount) : "",
    manuallyMarkedAsPaid: booking.manuallyMarkedAsPaid,
    guestListEntries: (booking.guestListEntries ?? []).map((guest) => ({
      feideUserId: guest.feideUserid,
      displayName: guest.displayName,
    })),
    doorAccessPolicy: booking.doorAccessPolicy,
    organizationDoorAccess: booking.organizationDoorAccess,
    bookerUser: pickedUser(booking.bookerUser),
    responsibleUser: pickedUser(booking.responsibleUser),
    occasion: booking.occasion ?? "",
    comment: booking.comment ?? "",
    adminComment: booking.adminComment ?? "",
    bookerMessage: booking.bookerMessage ?? "",
  };
}

export function mergeBookingEdits(current: Record<string, BookingEdit>, bookings: readonly AdminBooking[]) {
  const next = { ...current };
  for (const booking of bookings) {
    next[booking.id] ??= bookingEditFrom(booking);
  }
  return next;
}
