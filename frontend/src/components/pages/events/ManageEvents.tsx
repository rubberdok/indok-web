import { useQuery } from "@apollo/client";
import { Button, Card, CardContent, Stack, StackProps, Typography } from "@mui/material";

import { NextLinkComposed } from "@/components/Link";
import { EventUserOrganizationsDocument } from "@/generated/graphql";

type Props = {
  url: string;
};
export const ManageActions: React.FC<Props & StackProps> = ({ url, ...props }) => (
  <Stack direction="row" spacing={1} {...props}>
    <Button component={NextLinkComposed} to="/events/new" variant="contained" color="contrast">
      Opprett
    </Button>
    <Button component={NextLinkComposed} to={url} variant="contained" color="contrast">
      Mine arrangementer
    </Button>
  </Stack>
);

export const ManageEvents: React.FC = () => {
  const { data } = useQuery(EventUserOrganizationsDocument);

  const organizations = data?.user?.organizations ?? [];

  let url = "/orgs";
  if (organizations.length === 1) {
    url = `/orgs/${organizations[0].id}`;
  }

  return (
    <>
      <Card elevation={0} sx={{ display: { xs: "none", sm: "block" }, bgcolor: "secondary.main" }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Administrer</Typography>
            <ManageActions url={url} />
          </Stack>
        </CardContent>
      </Card>
      <ManageActions url={url} display={{ xs: "block", sm: "none" }} />
    </>
  );
};
