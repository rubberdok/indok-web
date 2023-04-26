import { useQuery } from "@apollo/client";
import { Add, FormatListBulleted } from "@mui/icons-material";
import { Button } from "@mui/material";

import { NextLinkComposed } from "@/components/Link";
import { EventUserOrganizationsDocument } from "@/generated/graphql";

import { AdminActions } from "./AdminActions";

const ManageEventActions: React.FC = () => {
  const { data } = useQuery(EventUserOrganizationsDocument);

  const organizations = data?.user?.organizations ?? [];

  let url = "/orgs";
  if (organizations.length === 1) {
    url = `/orgs/${organizations[0].id}`;
  }
  return (
    <>
      <Button startIcon={<Add />} component={NextLinkComposed} to="/events/new" variant="contained" color="secondary">
        Opprett
      </Button>
      <Button
        startIcon={<FormatListBulleted />}
        component={NextLinkComposed}
        to={url}
        variant="contained"
        color="secondary"
      >
        Mine arrangementer
      </Button>
    </>
  );
};

export const ManageEvents: React.FC = () => {
  return (
    <AdminActions>
      <ManageEventActions />
    </AdminActions>
  );
};
