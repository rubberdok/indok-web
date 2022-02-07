import { People } from "@material-ui/icons";
import { Typography, Grid, Avatar, useTheme } from "@material-ui/core";
import Image from "next/image";
import { BaseOrg } from "./types";

type Props = {
  org: BaseOrg;
};

/**
 * Renders the name of the given organization next to its logo,
 * or a default icon in the case of no logo.
 */
const OrgListItem: React.VFC<Props> = ({ org }) => {
  const theme = useTheme();

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
          {org.logoUrl ? <Image alt="org logo" src={org.logoUrl} /> : <People />}
        </Avatar>
      </Grid>
      <Grid item>
        <Typography variant="overline" color="textPrimary">
          {org.name}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OrgListItem;
