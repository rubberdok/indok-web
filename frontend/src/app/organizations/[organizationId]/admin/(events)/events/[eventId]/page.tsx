import { RedirectType, permanentRedirect } from "next/navigation";

export default function Page({ params }: { params: { organizationId: string; eventId: string } }) {
  return permanentRedirect(
    `/organizations/${params.organizationId}/admin/events/${params.eventId}/about`,
    RedirectType.replace
  );
}
