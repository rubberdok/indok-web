"use client";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import { redirect, useRouter, useSelectedLayoutSegment } from "next/navigation";

import { Breadcrumbs } from "@/app/components/Breadcrumbs";

const nameBySegment: Record<string, string> = {
  all: "Alle",
  confirmed: "Bekreftet",
  rejected: "Avslått",
  pending: "Nye",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  if (!segment) return redirect("/cabins/admin/bookings/pending");

  const segmentName = nameBySegment[segment];
  if (!segmentName) return redirect("/cabins/admin/bookings/pending");
  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          { name: "Administrer hytter", href: "/cabins/admin" },
          { name: "Bestillinger", href: "/cabins/admin/bookings" },
          { name: segmentName, href: `/cabins/admin/bookings/${segment}` },
        ]}
      />
      <Typography variant="subtitle1" gutterBottom>
        Bestillinger
      </Typography>
      <Container disableGutters maxWidth="md">
        <Tabs
          sx={{ mb: 2 }}
          variant="fullWidth"
          value={segment}
          onChange={(_e, value: "all" | "confirmed" | "rejected" | "pending") => {
            router.push(`/cabins/admin/bookings/${value}`);
          }}
        >
          <Tab label="Nye" value="pending" />
          <Tab label="Bekreftet" value="confirmed" />
          <Tab label="Avslått" value="rejected" />
          <Tab label="Alle" value="all" />
        </Tabs>
        {children}
      </Container>
    </Container>
  );
}
