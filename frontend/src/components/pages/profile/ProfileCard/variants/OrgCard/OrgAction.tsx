import { Organization } from "@interfaces/organizations";
import { Typography, Box, Menu, CardActions, MenuItem } from "@material-ui/core";
import OrgListItem from "./OrgListItem";
import { useState } from "react";
import { useRouter } from "next/router";
import { IntegrationTestProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";

export type Props = {
  orgs: Pick<Organization, "id" | "name" | "logoUrl">[];
};

const OrgAction: React.VFC<Props & IntegrationTestProps> = ({ orgs, ...props }) => {
  if (!orgs) {
    return (
      <Box fontStyle="italic">
        <Typography>Ingen organisasjoner</Typography>
      </Box>
    );
  }

  return <OrgList orgs={orgs} {...props} />;
};
export default OrgAction;

const OrgList: React.VFC<Props & IntegrationTestProps> = ({ orgs, "data-test-id": dataTestId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <CardActions onClick={() => setOpen(true)} data-test-id={`${dataTestId}link`}>
        Dine organisasjoner
      </CardActions>
      <Menu open={open} onClose={() => setOpen(false)}>
        {orgs.map((org) => {
          <MenuItem onClick={() => router.push(`/orgs/${org.id}`)}>
            <OrgListItem org={org} />
          </MenuItem>;
        })}
      </Menu>
    </>
  );
};
