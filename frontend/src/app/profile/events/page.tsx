"use client";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Container, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container>
      <Breadcrumbs
        links={[
          { href: "/", name: "Hjem" },
          { href: "/profile", name: "Profil" },
          { href: "/profile/events", name: "Arrangementer" },
        ]}
      />
      <Typography variant="subtitle1" component="h1">
        Arrangementer
      </Typography>
    </Container>
  );
}
