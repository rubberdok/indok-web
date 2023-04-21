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
  Popover,
  Stack,
  Theme,
  Typography,
  Unstable_Grid2 as Grid,
  useMediaQuery,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useState } from "react";

export const ColorModeSwitcher: React.FC = () => {
  const { handleOpen, handleClose, dialogOpen, popoverOpen, anchorEl } = useColorSchemePreview();

  return (
    <>
      <Stack justifyContent="center" alignItems="center">
        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label="Åpne dialog for å velge utseende"
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
          onClick={handleOpen}
          aria-label="Åpne dialog for å velge utseende"
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

      <Dialog open={dialogOpen} onClose={() => handleClose()} fullWidth maxWidth="xs">
        <DialogTitle>Utseende</DialogTitle>
        <DialogContent>
          <ColorModePreview />
        </DialogContent>
      </Dialog>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Card
          sx={{
            width: "500px",
          }}
        >
          <CardContent>
            <ColorModePreview />
          </CardContent>
        </Card>
      </Popover>
    </>
  );
};

function useColorSchemePreview() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));
  const dialogOpen = Boolean(anchorEl) && !isDesktop;
  const popoverOpen = Boolean(anchorEl) && isDesktop;

  function handleOpen(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  return { dialogOpen, popoverOpen, handleOpen, handleClose, anchorEl };
}

function ColorModePreview() {
  const { mode, setMode } = useColorScheme();
  return (
    <Grid container direction="row" spacing={2} sx={{ aspectRatio: { xs: "11/4", md: "12/4" } }}>
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
            <CardActionArea
              sx={{ width: "100%", height: "100%" }}
              onClick={() => setMode("light")}
              aria-labelledby="light-mode-label"
            >
              <Grow in={mode === "light"} appear={false}>
                <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
              </Grow>
              <CardContentPreview />
            </CardActionArea>
          </Card>
        </Grid>
        <Grid>
          <Typography id="light-mode-label" variant="body2">
            Lys
          </Typography>
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
            <CardActionArea
              sx={{ width: "100%", height: "100%" }}
              onClick={() => setMode("dark")}
              aria-labelledby="dark-mode-label"
            >
              <Grow in={mode === "dark"} appear={false}>
                <CheckCircle sx={{ position: "absolute", bottom: 0, right: 0, color: "text.primary" }} />
              </Grow>
              <CardContentPreview />
            </CardActionArea>
          </Card>
        </Grid>
        <Grid>
          <Typography variant="body2" id="dark-mode-label">
            Mørk
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={1} xs={4}>
        <Grid container xs spacing={0}>
          <Card variant="outlined" sx={{ height: "100%", width: "100%", padding: "none", position: "relative" }}>
            <CardActionArea
              sx={{ height: "100%", width: "100%" }}
              onClick={() => setMode("system")}
              aria-labelledby="system-mode-label"
            >
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
          <Typography variant="body2" id="system-mode-label">
            Automatisk
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

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
