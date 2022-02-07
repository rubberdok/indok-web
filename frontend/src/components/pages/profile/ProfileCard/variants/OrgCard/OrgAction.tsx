import { Organization } from "@interfaces/organizations";
import { Box, CardActionArea, CardActions, Typography } from "@material-ui/core";
import Link from "next/link";
import OrgListAction from "./OrgListAction";
import OrgListItem from "./OrgListItem";

export type Props = {
  orgs: Pick<Organization, "id" | "name" | "logoUrl">[];
  "data-test-id"?: string;
};

/**
 * Card action for the organization card on the profile page.
 *
 * Takes a list of orgs, and displays different components depending on its length:
 * - 0 orgs: Grayed-out text
 * - 1 org: Link to its org admin page
 * - 2+ orgs: Menu with links to their admin pages
 */
const OrgAction: React.VFC<Props> = ({ orgs, "data-test-id": dataTestId, ...props }) => {
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
            <CardActions data-test-id={dataTestId}>
              <OrgListItem org={orgs[0]} />
            </CardActions>
          </Link>
        </CardActionArea>
      );
    default:
      return <OrgListAction orgs={orgs} {...props} />;
  }
};

export default OrgAction;
