import { Organization } from "@interfaces/organizations";
import { Typography, Box, Menu, CardActions, MenuItem, CardActionArea } from "@material-ui/core";
import OrgListItem from "./OrgListItem";
import { useState } from "react";
import Link from "next/link";
import { ProfileActionProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";
import { useRouter } from "next/router";

const orgLink = (orgId: string) => `/orgs/${orgId}`;

export type Props = {
  orgs: Pick<Organization, "id" | "name" | "logoUrl">[];
};

/**
 * Function that returns a functional component for use as a profile card action.
 * The outer function takes the props not required by the card action.
 * The inner function takes the remaining props as required for the card.
 *
 * This function takes a list of orgs, and returns different components depending on its length:
 * - No orgs: Text
 * - 1 org: List to its org admin page
 * - Multiple orgs: Menu with links to their admin pages
 */
export const createOrgProfileAction = ({ orgs }: Props): React.VFC<ProfileActionProps> => {
  const OrgProfileAction: React.VFC<ProfileActionProps> = (actionProps) => {
    switch (orgs.length) {
      case 0:
        return (
          <Box fontStyle="italic">
            <CardActions>
              <Typography variant="overline" color="textSecondary">
                Ingen organisasjoner
              </Typography>
            </CardActions>
          </Box>
        );
      case 1:
        return (
          <CardActionArea>
            <Link href={orgLink(orgs[0].id)} passHref>
              <CardActions data-test-id={actionProps["data-test-id"]}>
                <OrgListItem org={orgs[0]} />
              </CardActions>
            </Link>
          </CardActionArea>
        );
      default:
        return <OrgList orgs={orgs} {...actionProps} />;
    }
  };

  return OrgProfileAction;
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
          <MenuItem key={org.id} onClick={() => router.push(orgLink(org.id))}>
            <OrgListItem org={org} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
