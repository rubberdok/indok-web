import { Stack, Typography } from "@mui/material";

import { AdminOrganizationFragment } from "@/generated/graphql";

import { EventsExport } from "./EventsExport";
import { OrgEventsTable } from "./OrgEventsTable";

type Props = { organization: AdminOrganizationFragment };

export const OrganizationEvents: React.FC<Props> = ({ organization }) => {
  return (
    <Stack spacing={4}>
      <Typography variant="h3">Oversikt</Typography>
      <OrgEventsTable organization={organization} />
      <Typography variant="h3">Eksport</Typography>
      <EventsExport organization={organization} />
    </Stack>
  );
};
