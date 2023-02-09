import { Container, Divider, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

import { RootStyle } from "@/layouts/Layout";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export const ShopTemplate: React.FC<React.PropsWithChildren<Props>> = ({ children, title, description }) => {
  return (
    <RootStyle>
      <Container>
        <Grid container spacing={12} justifyContent="center">
          <Grid item md={12}>
            <Stack
              spacing={3}
              sx={{
                pb: 3,
                textAlign: "center",
                pt: { xs: 3, md: 5 },
              }}
            >
              <Typography variant="body2" sx={{ color: "text.disabled" }}></Typography>
              <Typography variant="h2" component="h1">
                {title}
              </Typography>
              <Typography variant="h5">{description}</Typography>
            </Stack>

            <Divider sx={{ mb: 6 }} />
            <>{children}</>
            <Divider sx={{ mt: 8 }} />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};
