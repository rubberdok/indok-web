// icons
import { Box, Button, Card, CardActionArea, Container, Grid, Stack, Typography } from "@mui/material";
// @mui
import { styled } from "@mui/material/styles";
import { ArrowRight, Link as LinkIcon } from "phosphor-react";

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(15, 0, 8, 0),
  // height: "vh",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(15, 0),
    height: "80vh",
    display: "flex",
    alignItems: "center",
  },
}));

const LandingHero: React.FC = () => {
  return (
    <>
      <RootStyle>
        <Container>
          <Grid container columnSpacing={14} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={6} lg={6} sx={{ textAlign: { xs: "center", md: "left", zIndex: 10 } }}>
              <Stack spacing={4} sx={{ mt: { xs: 0, md: 8 } }}>
                <Typography variant="overline" sx={{ color: "primary.main" }}>
                  Foreningen for studentene ved
                </Typography>

                <Typography variant="h1">Industriell Økonomi & Teknologiledelse</Typography>

                {/* <Typography sx={{ color: 'text.secondary' }}>
                Den øverste instansen for all studentfrivillighet på masterstudiet Indøk ved NTNU.
              </Typography> */}

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent={{ xs: "center", md: "unset" }}
                  spacing={2}
                >
                  <Button variant="contained" size="large">
                    Les om foreningen
                  </Button>
                  <Button variant="contained" color="inherit" size="large">
                    Se arrangementer
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Box
                component="img"
                sx={{
                  objectFit: "cover",
                  height: "100vh",
                  float: "right",
                  zIndex: -1,
                  position: "absolute",
                  top: 0,
                }}
                alt="marketing-market"
                src="/hero.jpg"
              />
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
      <Box
        sx={{
          width: "100vw",
          py: { xs: 4, md: 6 },
          px: 1,
          bgcolor: "background.neutral",
          borderTop: "1px solid",
          borderColor: "divider",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Container>
          <Stack direction="row" spacing={3} minWidth="max-content" pr={3} alignItems="center">
            <Box mr={{ xs: 2, md: 6 }}>
              <Typography variant="h4">
                Våre <br />
                Foreninger
              </Typography>
            </Box>
            <Card sx={{ boxShadow: (theme) => theme.customShadows.z24 }}>
              <CardActionArea sx={{ px: 4, py: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                  <Typography variant="h6">Bindeleddet</Typography>
                  <LinkIcon width={20} height={20} />
                </Stack>
              </CardActionArea>
            </Card>
            <Card sx={{ boxShadow: (theme) => theme.customShadows.z24 }}>
              <CardActionArea sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                  <Typography variant="h6">ESTIEM</Typography>
                  <LinkIcon width={20} height={20} />
                </Stack>
              </CardActionArea>
            </Card>
            <Card sx={{ boxShadow: (theme) => theme.customShadows.z24 }}>
              <CardActionArea sx={{ p: 3 }}>
                <Typography variant="h6">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                    <Typography variant="h6">Janus</Typography>
                    <LinkIcon width={20} height={20} />
                  </Stack>
                </Typography>
              </CardActionArea>
            </Card>
            <Card sx={{ boxShadow: (theme) => theme.customShadows.z24 }}>
              <CardActionArea sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      opacity: 0.44,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                  <Typography variant="h6">Indøk Kultur</Typography>
                </Stack>
              </CardActionArea>
            </Card>
            <Card sx={{ boxShadow: (theme) => theme.customShadows.z24 }}>
              <CardActionArea sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      opacity: 0.44,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                  <Typography variant="h6">Janus IF</Typography>
                </Stack>
              </CardActionArea>
            </Card>
            <Card sx={{ boxShadow: (theme) => theme.customShadows.z24 }}>
              <CardActionArea sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      opacity: 0.44,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                  <Typography variant="h6">Hyttestyret</Typography>
                </Stack>
              </CardActionArea>
            </Card>
            <Button color="inherit" size="large" endIcon={<ArrowRight />}>
              Se mer
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default LandingHero;
