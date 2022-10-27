import { Stack, Typography } from "@mui/material";

import { EventsExport } from "@/components/pages/events/org/EventsExport";
import { OrgEventsTable } from "@/components/pages/events/org/OrgEventsTable";
import { AdminOrganizationFragment } from "@/generated/graphql";

type Props = { organization: AdminOrganizationFragment };

export const OrgEvents: React.FC<Props> = ({ organization }) => {
  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt</Typography>
      <OrgEventsTable organization={organization} />
      <Typography variant="h3">Eksport</Typography>
      <EventsExport organization={organization} />
    </Stack>
  );
};
