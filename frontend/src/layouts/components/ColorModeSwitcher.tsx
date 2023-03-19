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
            <Grid container direction="column" spacing={1} data-color-scheme="light" xs={4}>
              <Grid xs>
                <Card
                  variant="outlined"
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <CardActionArea sx={{ width: "100%", height: "100%" }} onClick={() => setMode("light")}>
                    <Grow in={mode === "light"} appear={false}>
                      <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
                    </Grow>
                    <CardContentPreview />
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid>
                <Typography variant="body2">Lys</Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={1} data-color-scheme="dark" xs={4}>
              <Grid xs>
                <Card
                  variant="outlined"
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <CardActionArea sx={{ width: "100%", height: "100%" }} onClick={() => setMode("dark")}>
                    <Grow in={mode === "dark"} appear={false}>
                      <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
                    </Grow>
                    <CardContentPreview />
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid>
                <Typography variant="body2">Mørk</Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={1} xs={4}>
              <Grid container xs spacing={0}>
                <Card variant="outlined" sx={{ height: "100%", width: "100%", padding: "none", position: "relative" }}>
                  <CardActionArea sx={{ height: "100%", width: "100%" }} onClick={() => setMode("system")}>
                    <Grid container sx={{ height: "100%" }} xs>
                      <Grid xs={6} data-color-scheme="dark">
                        <CardContentPreview />
                      </Grid>
                      <Grid xs={6} data-color-scheme="light">
                        <Grow in={mode === "system"} appear={false}>
                          <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
                        </Grow>
                        <CardContentPreview />
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

function CardContentPreview() {
  return (
    <CardContent
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        padding: theme.spacing(2, 0, 0, 2),
        bgcolor: "background.elevated",
        "&:last-child": {
          paddingBottom: 0,
        },
      })}
    >
      <Card
        sx={(theme) => ({
          width: "100%",
          height: "100%",
          p: theme.spacing(1),
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 0,
        })}
      >
        <Typography sx={{ lineHeight: 1 }}>Aa</Typography>
      </Card>
    </CardContent>
  );
}
