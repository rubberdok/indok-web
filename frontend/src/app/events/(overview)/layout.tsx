"use client";

import { Title } from "@/components/Title";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";
import { Container, Tab, Tabs } from "@mui/material";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

export default function Layout({ children }: React.PropsWithChildren) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  return (
    <>
      <Title
        title="Arrangementer"
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Arrangementer", href: "/events" },
        ]}
      >
        <Tabs
          value={segment}
          onChange={(_e, val: null | "calendar") => {
            if (val) {
              router.push(`/events/${val}`);
            } else {
              router.push("/events");
            }
          }}
        >
          <Tab value={null} label="Arrangementer" />
          <Tab value="calendar" label="Kalender" />
        </Tabs>
      </Title>
      <Container>{children}</Container>
    </>
  );
}
