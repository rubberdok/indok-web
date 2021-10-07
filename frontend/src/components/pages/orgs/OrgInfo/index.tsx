import { Organization } from "@interfaces/organizations";
import { Grid, Typography } from "@material-ui/core";
import { useState } from "react";

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
      </Grid>
    </Grid>
  );
};

export default OrgInfo;
