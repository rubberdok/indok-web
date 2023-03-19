import { CheckCircle, DarkMode, LightMode } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grow,
  IconButton,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useState } from "react";

export const ColorModeSwitcher: React.FC = () => {
  const { mode, setMode } = useColorScheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Stack justifyContent="center" alignItems="center">
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={(theme) => ({
            color: "text.primary",
            position: "absolute",
            visibility: "visible",
            [theme.getColorSchemeSelector("dark")]: {
              visibility: "hidden",
            },
          })}
        >
          <LightMode fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={(theme) => ({
            color: "text.primary",
            position: "absolute",
            visibility: "visible",
            [theme.getColorSchemeSelector("light")]: {
              visibility: "hidden",
            },
          })}
        >
          <DarkMode fontSize="small" />
        </IconButton>
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Utseende</DialogTitle>
        <DialogContent>
          <Grid container direction="row" spacing={2} sx={{ aspectRatio: "11/4" }}>
            <Grid
              container
              direction="column"
              spacing={1}
              data-color-scheme="light"
              xs={4}
              onClick={() => setMode("light")}
              role="button"
            >
              <Grid xs>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor: "background.elevated",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <CardActionArea sx={{ width: "100%", height: "100%" }}>
                    <CardContent
                      sx={(theme) => ({ width: "100%", height: "100%", padding: theme.spacing(2, 0, 0, 2) })}
                    >
                      <Grow in={mode === "light"}>
                        <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
                      </Grow>
                      <Card sx={(theme) => ({ width: "150%", height: "150%", p: theme.spacing(1) })}>
                        <Typography sx={{ lineHeight: 1 }}>Aa</Typography>
                      </Card>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid>
                <Typography variant="body2">Lys</Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              spacing={1}
              data-color-scheme="dark"
              xs={4}
              onClick={() => setMode("dark")}
            >
              <Grid xs>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor: "background.elevated",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <CardActionArea sx={{ width: "100%", height: "100%" }}>
                    <CardContent
                      sx={(theme) => ({ width: "100%", height: "100%", padding: theme.spacing(2, 0, 0, 2) })}
                    >
                      <Grow in={mode === "dark"}>
                        <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
                      </Grow>
                      <Card sx={(theme) => ({ width: "150%", height: "150%", p: theme.spacing(1) })}>
                        <Typography sx={{ lineHeight: 1 }}>Aa</Typography>
                      </Card>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid>
                <Typography variant="body2">Mørk</Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={1} xs={4} onClick={() => setMode("system")}>
              <Grid container xs spacing={0}>
                <Card variant="outlined" sx={{ height: "100%", width: "100%", padding: "none", position: "relative" }}>
                  <CardActionArea sx={{ height: "100%", width: "100%" }}>
                    <Grid container sx={{ height: "100%" }} xs>
                      <Grid xs={6} data-color-scheme="dark">
                        <CardContent
                          sx={(theme) => ({
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            bgcolor: "background.elevated",
                            padding: theme.spacing(2, 0, 0, 2),
                            width: "100%",
                            height: "100%",
                          })}
                        >
                          <Card sx={(theme) => ({ width: "150%", height: "150%", p: theme.spacing(1) })}>
                            <Typography sx={{ lineHeight: 1 }}>Aa</Typography>
                          </Card>
                        </CardContent>
                      </Grid>
                      <Grid xs={6} data-color-scheme="light">
                        <CardContent
                          sx={(theme) => ({
                            margin: "none",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            bgcolor: "background.elevated",
                            padding: theme.spacing(2, 0, 0, 2),
                            width: "100%",
                            height: "100%",
                          })}
                        >
                          <Card sx={(theme) => ({ width: "150%", height: "150%", p: theme.spacing(1) })}>
                            <Typography sx={{ lineHeight: 1 }}>Aa</Typography>
                          </Card>
                        </CardContent>
                        <Grow in={mode === "system"}>
                          <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
                        </Grow>
                      </Grid>
                    </Grid>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid>
                <Typography variant="body2">Automatisk</Typography>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
