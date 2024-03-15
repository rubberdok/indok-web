import { Unstable_Grid2 as Grid } from "@mui/material";

import { Organization } from "@/app/_components/Organization";

import { organizationData } from "../_data/organizations";

export default function Page() {
  return (
    <Grid container alignItems="stretch" spacing={2} direction="row">
      {organizationData.map(({ organization }) => (
        <Grid xs={12} sm={6} md={3} key={organization.id}>
          <Organization organization={organization} link={`/about/organizations/${organization.id}`} />
        </Grid>
      ))}
    </Grid>
  );
}
