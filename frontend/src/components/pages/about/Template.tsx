import { Container, Divider, Hidden, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

import { RootStyle } from "@/layouts/Layout";

import { AboutPageArrow, AboutPostProps } from "./AboutPageArrow";
import { AboutSidebar } from "./AboutSidebar";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
  prevPost?: AboutPostProps;
  nextPost?: AboutPostProps;
};

export const Template: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  title,
  description,
  prevPost,
  nextPost,
}) => {
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
