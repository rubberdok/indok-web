import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";
import { FreeMode, Mousewheel, Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Organization, OrganizationLink } from "./OrganizationLink";

const organizations: Readonly<Organization[]> = [
  { name: "Janus", internalUrl: "/janus/info" },
  { name: "Bindeleddet", externalUrl: "https://www.bindeleddet.no" },
  { name: "ESTIEM", externalUrl: "https://sites.google.com/view/estiem-ntnu" },
  { name: "Janus Kultur", internalUrl: "/about/organization?category=kultur" },
  { name: "Rubberdøk", internalUrl: "/about/organizations/rubberdok" },
  { name: "Janushyttene", internalUrl: "/about/organizations/Janushyttene" },
  { name: "Janus IF", internalUrl: "/about/organization?category=idrett" },
] as const;

const ArrowStyle = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  cursor: "pointer",
  display: "none",
  position: "absolute",
  backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.grey[600],
  color: theme.palette.common.white,
  opacity: 0.88,
  zIndex: 1000,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  transition: "0.1s ease all",
  "&:hover": {
    opacity: 1,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
  },
  "&.right": {
    right: theme.spacing(3),
  },
  "&.left": {
    left: theme.spacing(3),
  },
  [theme.breakpoints.up("md")]: {
    display: "block",
  },
  "&.swiper-button-disabled, &:disabled": {
    opacity: "0",
    transform: "scale(0)",
  },
}));

type Props = {
  offsetX: number;
  onActiveIndexChange: (index: number) => void;
};

const Organizations: React.FC<Props> = ({ offsetX, onActiveIndexChange }) => {
  return (
    <>
      <ArrowStyle className="arrow left">
        <ArrowLeft />
      </ArrowStyle>
      <Box
        sx={{
          "& .swiper-slide": { my: "auto" },
          "& .swiper": { overflow: "visible" },
          overscrollBehavior: "none",
        }}
        position="absolute"
        right={0}
        width={`calc(100vw - ${offsetX}px)`}
      >
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel]}
          onActiveIndexChange={(swiper) => onActiveIndexChange(swiper.activeIndex)}
          navigation={{ nextEl: ".arrow.right", prevEl: ".arrow.left" }}
          spaceBetween={16}
          mousewheel={{
            forceToAxis: true,
          }}
          slidesPerView={0.8}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.25,
            momentumVelocityRatio: 0.25,
            minimumVelocity: 0.05,
            momentumBounce: false,
          }}
          breakpoints={{
            930: {
              slidesPerView: 3,
              spaceBetween: 24,
              freeMode: false,
            },
            1350: {
              slidesPerView: 4.2,
              spaceBetween: 24,
              freeMode: false,
            },
          }}
        >
          {organizations.map((organization) => (
            <SwiperSlide key={organization.name}>
              <OrganizationLink organization={organization} />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <Link passHref href="/about/organization">
              <Button color="secondary" variant="contained" size="large" endIcon={<ArrowRight />}>
                Alle organisasjoner
              </Button>
            </Link>
          </SwiperSlide>
        </Swiper>
      </Box>
      <ArrowStyle className="arrow right">
        <ArrowRight />
      </ArrowStyle>
    </>
  );
};

export default Organizations;
