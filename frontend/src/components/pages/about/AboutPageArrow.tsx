import { Avatar, Box, CardActionArea, Grid, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { CaretLeft, CaretRight } from "phosphor-react";

type AboutPostProps = {
  slug: string;
  title: string;
  cover?: string;
};

type Props = {
  prevPost?: AboutPostProps;
  nextPost?: AboutPostProps;
};

const AboutPageArrow: React.FC<Props> = ({ prevPost, nextPost }) => {
  const nextSlug = nextPost?.slug || "";
  const prevSlug = prevPost?.slug || "";

  return (
    <Grid container spacing={5} sx={{ py: 8 }}>
      <Grid item xs={12} md={6}>
        {prevPost && (
          <PostItem
            href={prevSlug}
            title={prevPost?.title}
            coverImg={prevPost?.cover}
            icon={<Box component={CaretLeft} sx={{ width: 24, height: 24, color: "text.disabled", flexShrink: 0 }} />}
          />
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        {nextSlug && (
          <PostItem
            href={nextSlug}
            isNext
            title={nextPost?.title}
            coverImg={nextPost?.cover}
            icon={<Box component={CaretRight} sx={{ width: 24, height: 24, color: "text.disabled", flexShrink: 0 }} />}
          />
        )}
      </Grid>
    </Grid>
  );
};

type PostItemProps = {
  coverImg?: string;
  title?: string;
  icon?: JSX.Element;
  href?: string;
  isNext?: boolean;
};

function PostItem({ coverImg, title, icon, href, isNext }: PostItemProps) {
  return (
    <CardActionArea sx={{ borderRadius: 2 }}>
      <NextLink href={href || ""} passHref>
        <Stack
          alignItems="center"
          direction={isNext ? "row-reverse" : "row"}
          spacing={2}
          sx={{
            p: 2.5,
            pl: 1,
            ...(isNext && {
              pr: 1,
            }),
          }}
        >
          {icon}
          <Avatar src={coverImg} sx={{ width: 64, height: 64 }} />
          <Stack
            spacing={0.5}
            sx={{
              ...(isNext && {
                textAlign: "right",
              }),
            }}
          >
            <Typography variant="overline" sx={{ color: "text.disabled" }}>
              Les mer
            </Typography>
            <Typography variant="subtitle1">{title}</Typography>
          </Stack>
        </Stack>
      </NextLink>
    </CardActionArea>
  );
}

export default AboutPageArrow;
