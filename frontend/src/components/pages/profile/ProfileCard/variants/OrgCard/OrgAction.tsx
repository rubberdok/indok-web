import { Typography, Box, CardActions, CardActionArea } from "@material-ui/core";
import OrgListItem from "./OrgListItem";
import Link from "next/link";
import { ProfileActionProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";
import { BaseOrg } from "./types";
import OrgList from "./OrgList";

export type Props = {
  orgs: BaseOrg[];
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
            <Link href={`/orgs/${orgs[0].id}`} passHref>
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
