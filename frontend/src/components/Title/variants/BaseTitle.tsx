import Breadcrumbs, { Props as BreadcrumbProps } from "@components/Breadcrumbs";
import { TLink } from "@components/Breadcrumbs/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { ImageProps, StaticImageData } from "next/image";
import { ImageContainer, ImageOverlay, OverlayProps, RootStyle } from "./styles";

const Image = dynamic(() => import("next/image"));

export type Props = {
  title?: string;
  overline?: string;
  breadcrumbs?: TLink[];
  sx?: SxProps<Theme>;
  BreadcrumbProps?: Partial<BreadcrumbProps>;
  bgImage?: StaticImageData | string;
  disableGutters?: boolean;
  ImageProps?: Partial<ImageProps>;
  OverlayProps?: OverlayProps & { sx?: SxProps<Theme> };
};

const Title: React.FC<Props> = ({
  title,
  children,
  breadcrumbs = [],
  overline,
  sx,
  bgImage,
  disableGutters,
  BreadcrumbProps,
  ImageProps,
  OverlayProps,
}) => {
  return (
    <RootStyle
      disableGutters={disableGutters}
      sx={{ ...sx, ...(bgImage && { backgroundColor: "transparent", overflow: "hidden" }), position: "relative" }}
    >
      {bgImage && (
        <ImageContainer>
          <ImageOverlay {...OverlayProps} />
          <Image src={bgImage} placeholder="blur" objectFit="cover" objectPosition="center" alt="" {...ImageProps} />
        </ImageContainer>
      )}
      <Container>
        <Stack direction="column" sx={{ pt: 5, pb: children ? 0 : 6 }} justifyContent="space-between">
          <Breadcrumbs sx={{ mb: { xs: 5, md: 8 } }} links={breadcrumbs} activeLast {...BreadcrumbProps} />
          <Box sx={{ position: "relative" }}>
            {overline && (
              <Typography variant="overline" color="grey.500" sx={{ position: "absolute" }}>
                {overline}
              </Typography>
            )}
            <Typography variant="h1" mb={4} mt={2}>
              {title}
            </Typography>
          </Box>
          {children}
        </Stack>
      </Container>
    </RootStyle>
  );
};

export default Title;
