import { Organization } from "@interfaces/organizations";
import { Typography, Box, Menu, Button, MenuItem } from "@material-ui/core";
import OrgListItem from "./OrgListItem";
import { useState } from "react";
import { useRouter } from "next/router";

export type Props = {
  orgs: Pick<Organization, "id" | "name" | "logoUrl">[];
};

const OrgAction: React.VFC<Props> = ({ orgs }) => {
  if (!orgs) {
    return (
      <Box fontStyle="italic">
        <Typography>Ingen organisasjoner</Typography>
      </Box>
    );
  }

  return <OrgList orgs={orgs} />;
};
export default OrgAction;

const OrgList: React.VFC<Props> = ({ orgs }) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <Button onClick={() => setOpen(true)}></Button>
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
