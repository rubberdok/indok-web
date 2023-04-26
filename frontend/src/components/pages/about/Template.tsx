import { Container, Divider, Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material";
import Head from "next/head";
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
    <>
      <Head>
        <title>{`${title} | Indøk NTNU - Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse`}</title>
        <meta name="description" content={description} />
      </Head>
      <RootStyle>
        <Container>
          <Grid container spacing={8}>
            <Grid md={3} display={{ xs: "none", md: "block" }}>
              <AboutSidebar />
            </Grid>

            <Grid xs={12} md={8}>
              <Stack spacing={6} direction="column" divider={<Divider />}>
                <Stack
                  spacing={3}
                  sx={{
                    textAlign: "center",
                    pt: { xs: 3, md: 5 },
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Om foreningen
                  </Typography>
                  <Typography variant="h2" component="h1">
                    {title}
                  </Typography>
                  <Typography variant="h5" component="p">
                    {description}
                  </Typography>
                </Stack>

                <div>{children}</div>

                {(prevPost || nextPost) && <AboutPageArrow prevPost={prevPost} nextPost={nextPost} />}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </>
  );
};
