import {
  Alert,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";

import { NextLinkComposed } from "@/app/components/Link";

export default function Page() {
  return (
    <>
      <Stack direction="column" alignItems="center" spacing={2}>
        <Alert severity="info" variant="outlined">
          Velg typen arrangement du vil opprette. Dette kan ikke endres etter at arragnementet er laget.
        </Alert>
        <Grid container direction={{ xs: "column", md: "row" }} spacing={2}>
          <Grid xs>
            <Card sx={{ height: 1 }}>
              <CardActionArea sx={{ height: 1 }} component={NextLinkComposed} to="/events/new/basic">
                <CardHeader title="Uten påmelding" />
                <CardContent>
                  <Typography variant="caption">Arrangementer uten påmelding er synlig for alle</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid xs>
            <Card sx={{ height: 1 }}>
              <CardActionArea sx={{ height: 1 }} component={NextLinkComposed} to="/events/new/sign-ups">
                <CardHeader title="Med påmelding" />
                <CardContent>
                  <Typography variant="caption">
                    På arrangmenter med påmelding kan du justere plassfordeling per trinn
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid xs>
            <Card sx={{ height: 1 }}>
              <CardActionArea sx={{ height: 1 }} component={NextLinkComposed} to="/events/new/tickets">
                <CardHeader title="Med billetter" />
                <CardContent>
                  <Typography variant="caption" component="span">
                    På arrangementer med billetter kan du selge billetter til arrangementet. Dette krever at dere har en
                    salgsenhet hos Vipps som skal motta betalingene.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
