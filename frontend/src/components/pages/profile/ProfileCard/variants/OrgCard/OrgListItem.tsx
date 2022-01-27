import { Organization } from "@interfaces/organizations";
import { People } from "@material-ui/icons";
import { Typography, Grid, Avatar } from "@material-ui/core";
import Image from "next/image";

type Props = {
  org: Pick<Organization, "id" | "name" | "logoUrl">;
};

const OrgListItem: React.VFC<Props> = ({ org }) => (
  <Grid container>
    <Grid item>
      <Avatar style={{ backgroundColor: "#526fa0" }}>{org.logoUrl ? <Image src={org.logoUrl} /> : <People />}</Avatar>
    </Grid>
    <Grid item>
      <Typography>{org.name}</Typography>
    </Grid>
  </Grid>
);

export default OrgListItem;
