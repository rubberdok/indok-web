import { Box, Container, Typography, Stack, NoSsr } from "@mui/material";
import { useRef, useState, useEffect } from "react";

import { Organizations } from "./Organizations";

export const OrganizationsSlider: React.FC = () => {
  const orgsTitleEl = useRef<HTMLElement>();

  const [sliderActiveIndex, setSliderActiveIndex] = useState(0);
  const [sliderOffsetX, setSliderOffsetX] = useState(0);

  const onActiveIndexChange = (index: number) => {
    setSliderActiveIndex(index);
  };

  const updateSliderOffset = () => {
    if (orgsTitleEl.current) {
      setSliderOffsetX(orgsTitleEl.current.offsetWidth + orgsTitleEl.current.offsetLeft);
    }
  };

  useEffect(() => {
    updateSliderOffset();
    window.addEventListener("resize", updateSliderOffset);
    return () => {
      window.removeEventListener("resize", updateSliderOffset);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        py: { xs: 4, md: 6 },
        px: 1,
        bgcolor: (theme) => theme.vars.palette.background.elevated,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Container>
        <Stack direction="row" minWidth="max-content" alignItems="center">
          <Box ref={orgsTitleEl}>
            <Typography
              variant="h4"
              sx={{
                opacity: sliderActiveIndex == 0 ? 1 : 0,
                transition: (theme) => theme.transitions.create("opacity"),
              }}
            >
              Våre <br />
              Foreninger
            </Typography>
          </Box>
          <NoSsr>
            <Organizations onActiveIndexChange={onActiveIndexChange} offsetX={sliderOffsetX + 48} />
          </NoSsr>
        </Stack>
      </Container>
    </Box>
  );
};
