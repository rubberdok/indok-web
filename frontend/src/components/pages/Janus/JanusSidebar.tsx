import { Box } from "@mui/material";

import { HEADER_DESKTOP_HEIGHT } from "@/theme/constants";

import { NavigationSidebar } from "../../";

const NAV_ITEMS = [
  {
    subheader: "Innhold",
    items: [
      {
        title: "Janusstyret",
        path: "/janus/info",
      },
      {
        title: "Kjellerbooking",
        path: "/janus/kjellerbooking",
      },
      {
        title: "Bildegalleri",
        path: "/janus/bildegalleri",
      },
      {
        title: "Indøk-kalender",
        path: "https://calendar.google.com/calendar/u/0/r?cid=c3AzcnJlNGhoamZvZmo4MTI0anA1azA5M29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
      },
      {
        title: "Kontakt oss",
        path: "https://indokntnu.no/janus/info#:~:text=Oskar%20G%C3%A5s%C3%B8-,President,-tlf%3A%20979%2062",
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
