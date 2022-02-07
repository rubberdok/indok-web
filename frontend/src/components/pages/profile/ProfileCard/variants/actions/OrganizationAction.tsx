import { Organization } from "@interfaces/organizations";
import { Box, CardActionArea, CardActions, Typography } from "@material-ui/core";
import Link from "next/link";
import OrgList from "../OrgCard/OrgList";
import OrgListItem from "../OrgCard/OrgList/OrgListItem";

export type Props = {
  orgs: Pick<Organization, "id" | "name" | "logoUrl">[];
  "data-test-id"?: string;
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
const OrganizationAction: React.VFC<Props> = ({ orgs, "data-test-id": dataTestId, ...props }) => {
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
      const org = orgs[0];
      return (
        <CardActionArea>
          <Link href={`/orgs/${org.id}`} passHref>
            <CardActions data-test-id={dataTestId}>
              <OrgListItem org={org} />
            </CardActions>
          </Link>
        </CardActionArea>
      );
    default:
      return <OrgList orgs={orgs} {...props} />;
  }
};

export default OrganizationAction;
