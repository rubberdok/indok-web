import { Box } from "@mui/material";

import { HEADER_DESKTOP_HEIGHT } from "@/theme/constants";

import { NavigationSidebar } from "../../";

const NAV_ITEMS = [
  {
    subheader: "Innhold",
    items: [
      {
        title: "JanusStyre",
        path: "/janus/info",
      },
    ],
  },
];

export const JanusSidebar: React.FC = () => {
  return (
    <Box position="relative" mt={13} height={1 / 2} sx={{ borderRight: "1px solid", borderColor: "divider" }}>
      <NavigationSidebar
        navConfig={NAV_ITEMS}
        sx={{
          borderRadius: 2,
          maxWidth: "100%",
          bgcolor: "background.default",
          top: HEADER_DESKTOP_HEIGHT + 16,
          position: "sticky",
        }}
      />
    </Box>
  );
};
