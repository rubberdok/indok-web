import { Organization } from "@interfaces/organizations";
import { Typography, Box, Menu, CardActions, MenuItem } from "@material-ui/core";
import OrgListItem from "./OrgListItem";
import { useState } from "react";
import Link from "next/link";
import { ProfileActionProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";

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
export const createOrgProfileAction =
  ({ orgs }: Props): React.VFC<ProfileActionProps> =>
  (actionProps) => {
    if (!orgs) {
      return (
        <Box fontStyle="italic">
          <Typography>Ingen organisasjoner</Typography>
        </Box>
      );
    }

    if (orgs.length === 1) {
      const org = orgs[0];
      return (
        <Link href={orgLink(org.id)} passHref>
          <CardActions data-test-id={actionProps["data-test-id"]}>
            <OrgListItem org={org} />
          </CardActions>
        </Link>
      );
    }

    return <OrgList orgs={orgs} {...actionProps} />;
  };

const OrgList: React.VFC<Props & ProfileActionProps> = ({ orgs, "data-test-id": dataTestId }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <CardActions onClick={() => setOpen(true)} data-test-id={`${dataTestId}link`}>
        Dine organisasjoner
      </CardActions>
      <Menu open={open} onClose={() => setOpen(false)}>
        {orgs.map((org) => {
          <Link href={orgLink(org.id)} passHref>
            <MenuItem>
              <OrgListItem org={org} />
            </MenuItem>
          </Link>;
        })}
      </Menu>
    </>
  );
};
