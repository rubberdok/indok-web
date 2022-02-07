import { useState } from "react";
import { useRouter } from "next/router";
import { CardActionArea, CardActions, Typography, Menu, MenuItem } from "@material-ui/core";
import { ProfileActionProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";
import { BaseOrg } from "./types";
import OrgListItem from "./OrgListItem";

export type Props = {
  orgs: BaseOrg[];
};

const OrgList: React.VFC<Props & ProfileActionProps> = ({ orgs, "data-test-id": dataTestId }) => {
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
          <MenuItem key={org.id} onClick={() => router.push(`/orgs/${org.id}`)}>
            <OrgListItem org={org} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default OrgList;
