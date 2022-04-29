import { Container, Divider, Hidden, Stack, styled, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import AboutPageArrow from "./AboutPageArrow";
import AboutSidebar from "./AboutSidebar";

type AboutPostProps = {
  slug: string;
  title: string;
  cover?: string;
};

type Props = {
  children: React.ReactNode;
  img?: string;
  title: string;
  description: string;
  page: string;
  prevPost?: AboutPostProps;
  nextPost?: AboutPostProps;
};

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const Template: React.FC<Props> = (props) => {
  const { children, title, description, prevPost, nextPost } = props;

  return (
    <RootStyle>
      <Container>
        <Grid container spacing={8}>
          <Hidden smDown>
            <Grid item md={3}>
              <AboutSidebar />
            </Grid>
          </Hidden>

          <Grid item xs={12} md={8}>
            <Stack
              spacing={3}
              sx={{
                pb: 6,
                textAlign: "center",
                pt: { xs: 3, md: 5 },
              }}
            >
              <Typography variant="body2" sx={{ color: "text.disabled" }}>
                Om foreningen
              </Typography>
              <Typography variant="h2" component="h1">
                {title}
              </Typography>
              <Typography variant="h5">{description}</Typography>
            </Stack>

            <Divider sx={{ mb: 6 }} />
            <>{children}</>
            <Divider sx={{ mt: 8 }} />

            {(prevPost || nextPost) && <AboutPageArrow prevPost={prevPost} nextPost={nextPost} />}
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default Template;
