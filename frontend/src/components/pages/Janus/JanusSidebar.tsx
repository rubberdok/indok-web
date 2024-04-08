import { Box, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";

import { Link } from "../../";

export const JanusSidebar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <Box position="relative" mt={13} height={1 / 2} sx={{ borderRight: "1px solid", borderColor: "divider" }}>
      <Tabs orientation="vertical" value={pathname}>
        <Tab component={Link} href="/janus" value="/janus" noLinkStyle label="Om JanusStyret" />
        <Tab
          component={Link}
          href="/janus/arrangementer"
          value="/janus/arrangementer"
          noLinkStyle
          label="Årlige Arrangementer"
        />
        <Tab
          component={Link}
          href="https://calendar.google.com/calendar/u/0/r?cid=c3AzcnJlNGhoamZvZmo4MTI0anA1azA5M29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
          value="https://calendar.google.com/calendar/u/0/r?cid=c3AzcnJlNGhoamZvZmo4MTI0anA1azA5M29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
          noLinkStyle
          label="Indøk kalender"
        />
        <Tab component={Link} href="/janus/shop" value="/janus/shop" noLinkStyle label="Butikk" />
        <Tab component={Link} href="/janus" value="/janus" noLinkStyle label="Kontakt oss" />
      </Tabs>
    </Box>
  );
};
