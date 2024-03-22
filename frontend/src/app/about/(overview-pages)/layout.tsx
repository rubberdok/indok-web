"use client";

import { Container, Stack, Tab, Tabs } from "@mui/material";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

export default function Layout({ children }: React.PropsWithChildren) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  return (
    <>
      <Container>
        <Stack direction="row" spacing={4}>
          <Tabs
            sx={{ minWidth: "min-content" }}
            orientation="vertical"
            value={segment}
            onChange={(_e, value: null | "organizations" | "hovedstyret" | "itv") => {
              if (value) return router.push(`/about/${value}`);
              router.push("/about");
            }}
          >
            <Tab label="Om oss" value={null}></Tab>
            <Tab label="Foreninger" value="organizations" />
            <Tab label="Hovedstyret" value="hovedstyret" />
            <Tab label="Instituttillitsvalgte" value="itv" />
          </Tabs>
          <Stack direction="column" width={1}>
            {children}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
