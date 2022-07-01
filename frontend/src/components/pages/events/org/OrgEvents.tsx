import EventsExport from "@components/pages/events/org/EventsExport";
import OrgEventsTable from "@components/pages/events/org/OrgEventsTable";
import { Organization } from "@interfaces/organizations";
import { Stack, Typography } from "@mui/material";

type Props = {
  organization: Organization;
};

const OrgEvents: React.FC<Props> = ({ organization }) => {
  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt</Typography>
      <OrgEventsTable organization={organization} />
      <Typography variant="h3">Eksport</Typography>
      <EventsExport organization={organization} />
    </Stack>
  );
};

export default OrgEvents;
