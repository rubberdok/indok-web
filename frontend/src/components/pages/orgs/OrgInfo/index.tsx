import { Organization } from "@interfaces/organizations";
import { Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import Link from "next/link";

type Props = {
  organization: Organization;
};

const OrgInfo: React.VFC<Props> = ({ organization }) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <Grid container>
      <Grid item>
        <Typography>{organization.name}</Typography>
        <Typography>{organization.description}</Typography>
        <Link href={`/orgs/${organization.id}/admin/editInfo`}>Rediger info</Link>
      </Grid>
    </Grid>
  );
};

export default OrgInfo;
