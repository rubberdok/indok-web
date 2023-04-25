import { Edit, Settings } from "@mui/icons-material";
import { Button } from "@mui/material";

import { NextLinkComposed } from "@/components/Link";

import { AdminActions } from "../AdminActions";

type Props = {
  eventId: string;
  organizationId: string;
};

const ManageEventActions: React.FC<Props> = ({ eventId, organizationId }) => {
  return (
    <>
      <Button
        component={NextLinkComposed}
        to={`/events/${eventId}/edit`}
        variant="contained"
        color="contrast"
        startIcon={<Edit />}
      >
        Rediger
      </Button>
      <Button
        component={NextLinkComposed}
        to={`/orgs/${organizationId}/events/${eventId}`}
        variant="contained"
        color="contrast"
        startIcon={<Settings />}
      >
        Administrer
      </Button>
    </>
  );
};

export const ManageEvent: React.FC<Props> = ({ eventId, organizationId }) => {
  return (
    <AdminActions>
      <ManageEventActions eventId={eventId} organizationId={organizationId} />
    </AdminActions>
  );
};
