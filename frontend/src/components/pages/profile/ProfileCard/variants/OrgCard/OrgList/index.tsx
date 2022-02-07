import { Organization } from "@interfaces/organizations";
import { CardActionArea, CardActions, Menu, MenuItem, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import OrgListItem from "./OrgListItem";

type Props = {
  orgs: Pick<Organization, "id" | "name" | "logoUrl">[];
  "data-test-id"?: string;
};

const OrgList: React.VFC<Props> = ({ orgs, "data-test-id": dataTestId }) => {
  const [menu, setMenu] = useState<{ open: boolean; anchor: Element | undefined }>({ open: false, anchor: undefined });
  const router = useRouter();

  return (
    <>
      <CardActionArea>
        <CardActions
          onClick={(event) => setMenu({ open: true, anchor: event.currentTarget })}
          data-test-id={`${dataTestId}link`}
        >
          <Typography variant="overline" color="textPrimary">
            Se organisasjoner
          </Typography>
        </CardActions>
      </CardActionArea>
      <Menu
        open={menu.open}
        onClose={() => setMenu({ open: false, anchor: undefined })}
        anchorEl={menu.anchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {orgs.map((org) => (
          <MenuItem onClick={() => router.push(`/orgs/${org.id}`)}>
            <OrgListItem org={org} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default OrgList;
