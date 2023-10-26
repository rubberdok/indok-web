import { Box, Container, Stack, Tabs, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { ImageProps, StaticImageData } from "next/image";

import { Props as BreadcrumbProps, Breadcrumbs, TLink } from "@/components/Breadcrumbs";

import { ImageContainer, ImageOverlay, OverlayProps, RootStyle } from "./styles";

// https://nextjs.org/docs/advanced-features/dynamic-import
const Image = dynamic(() => import("next/image"));

export type Props = {
  title?: string;
  overline?: string;
  breadcrumbs?: TLink[];
  sx?: SxProps<Theme>;
  BreadcrumbProps?: Partial<BreadcrumbProps>;
  bgImage?: StaticImageData | string;
  ImageProps?: Partial<ImageProps>;
  OverlayProps?: OverlayProps & { sx?: SxProps<Theme> };
};

export const BaseTitle: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
  breadcrumbs = [],
  overline,
  sx,
  bgImage,
  BreadcrumbProps,
  ImageProps,
  OverlayProps,
}) => {
  return (
    <RootStyle
      sx={{ ...sx, ...(bgImage && { backgroundColor: "transparent", overflow: "hidden" }), position: "relative" }}
    >
      {bgImage && (
        <ImageContainer>
          <ImageOverlay {...OverlayProps} />
          <Image
            src={bgImage}
            placeholder="blur"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            alt=""
            {...ImageProps}
          />
        </ImageContainer>
      )}
      <Container>
        <Stack direction="column" sx={{ pt: 3 }} justifyContent="space-between">
          <Breadcrumbs sx={{ mb: 5 }} links={breadcrumbs} {...BreadcrumbProps} />
          <Box>
            <Typography variant="overline" color="text.secondary">
              {overline ? overline : <>&nbsp;</>}
            </Typography>
            <Typography variant="h2" component="h1" mb={4}>
              {title}
            </Typography>
          </Box>
          {children ? <>{children}</> : <Tabs />}
        </Stack>
      </Container>
    </RootStyle>
  );
};
