import { ArrowForward } from "@mui/icons-material";
import { Button, Container, NoSsr, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import { Link } from "@/components";

import { Organization, OrganizationLink } from "./OrganizationLink";

const organizations: Readonly<Organization[]> = [
  { name: "Janus", externalUrl: "https://www.januslinjeforening.no" },
  { name: "Bindeleddet", externalUrl: "https://www.bindeleddet.no" },
  { name: "ESTIEM", externalUrl: "https://sites.google.com/view/estiem-ntnu" },
  { name: "Indøk Kultur", internalUrl: "/about/organization?category=kultur" },
  { name: "Rubberdøk", internalUrl: "/about/organizations/rubberdok" },
  { name: "Hytteforeningen", internalUrl: "/about/organizations/hytteforeningen" },
  { name: "Janus IF", internalUrl: "/about/organization?category=idrett" },
] as const;

export const OrganizationsSlider: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth={false} disableGutters sx={{ bgcolor: "background.elevated", py: 4 }}>
      <Container>
        <Stack
          direction="row"
          spacing={8}
          sx={{
            "& .swiper-slide": {
              width: "min-content",
              display: "flex",
              alignItems: "center",
            },
            minHeight: "4.5rem",
          }}
        >
          <NoSsr>
            <Swiper cssMode spaceBetween={parseInt(theme.spacing(4))} slidesPerView="auto" direction="horizontal">
              <SwiperSlide>
                <Typography variant="h4" component="h2">
                  Våre
                  <br />
                  foreninger
                </Typography>
              </SwiperSlide>
              {organizations.map((org) => (
                <SwiperSlide key={org.name}>
                  <OrganizationLink organization={org} />
                </SwiperSlide>
              ))}
              <SwiperSlide>
                <Button
                  component={Link}
                  noLinkStyle
                  href="/about/organization"
                  color="contrast"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  <Typography variant="inherit" noWrap>
                    Alle organisasjoner
                  </Typography>
                </Button>
              </SwiperSlide>
            </Swiper>
          </NoSsr>
        </Stack>
      </Container>
    </Container>
  );
};
