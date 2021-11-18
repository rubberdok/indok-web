import { Organization } from "@interfaces/organizations";
import OrgEventsTable from "@components/pages/events/org/OrgEventsTable";
import EventsExport from "@components/pages/events/org/EventsExport";

type Props = {
  organization: Organization;
}

const OrgEvents: React.FC<Props> = ({ organization }) => {
  return <>
    <OrgEventsTable organization={organization} />
    <EventsExport organization={organization} />
  </>
}

export default OrgEvents;