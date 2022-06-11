import { Box } from "@mui/material";
import { HEADER_DESKTOP_HEIGHT } from "src/theme/constants";
import { NavigationSidebar } from "../../";

const NAV_ITEMS = [
  {
    subheader: "Innhold",
    items: [
      { title: "Om oss", path: "/about" },
      {
        title: "Våre foreninger",
        path: "/about/organization",
      },
      {
        title: "Hovedstyret",
        path: "/about/board",
      },
    ],
  },
];

const AboutSidebar: React.FC = () => {
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

export default AboutSidebar;
