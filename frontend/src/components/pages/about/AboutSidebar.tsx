import { Box, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";

import { Link } from "../../";

export const AboutSidebar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <Box position="relative" mt={13} height={1 / 2} sx={{ borderRight: "1px solid", borderColor: "divider" }}>
      <Tabs orientation="vertical" value={pathname}>
        <Tab component={Link} href="/about" value="/about" noLinkStyle label="Om oss" />
        <Tab
          component={Link}
          href="/about/organization"
          value="/about/organization"
          noLinkStyle
          label="Våre foreninger"
        />
        <Tab component={Link} href="/about/board" value="/about/board" noLinkStyle label="Hovedstyret" />
        <Tab component={Link} href="/about/itv" value="/about/itv" noLinkStyle label="Instituttillitsvalgte" />
      </Tabs>
    </Box>
  );
};
