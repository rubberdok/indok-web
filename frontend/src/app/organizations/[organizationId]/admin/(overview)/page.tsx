import { redirect } from "next/navigation";

export default function Page({ params }: { params: { organizationId: string } }) {
  return redirect(`/organizations/${params.organizationId}/admin/events`);
}
