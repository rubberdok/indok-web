import { RedirectType, permanentRedirect } from "next/navigation";

export default function Page() {
  return permanentRedirect("/cabins/admin/bookings/pending", RedirectType.replace);
}
