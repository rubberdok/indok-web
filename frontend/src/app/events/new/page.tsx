import { Button, Card, CardContent, Unstable_Grid2 as Grid } from "@mui/material";

import { NextLinkComposed } from "@/app/components/Link";

export default function Page() {
  return (
    <Card>
      <CardContent>
        <Grid container direction="row" spacing={2}>
          <Grid xs>
            <Button
              component={NextLinkComposed}
              to="/events/new/basic"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ height: 1 }}
              size="large"
            >
              Uten påmelding
            </Button>
          </Grid>
          <Grid xs>
            <Button
              component={NextLinkComposed}
              to="/events/new/sign-ups"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ height: 1 }}
              size="large"
            >
              Med påmelding
            </Button>
          </Grid>
          <Grid xs>
            <Button
              component={NextLinkComposed}
              to="/events/new/tickets"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ height: 1 }}
              size="large"
            >
              Med billetter
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
