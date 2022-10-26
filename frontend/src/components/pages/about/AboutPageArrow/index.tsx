import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";

import { PostItem } from "./PostItem";

export type AboutPostProps = {
  slug: string;
  title: string;
  cover?: string;
};

type Props = {
  prevPost?: AboutPostProps;
  nextPost?: AboutPostProps;
};

export const AboutPageArrow: React.FC<React.PropsWithChildren<Props>> = ({ prevPost, nextPost }) => {
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
            icon={<Box component={ChevronLeft} sx={{ width: 24, height: 24, color: "text.disabled", flexShrink: 0 }} />}
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
            icon={
              <Box component={ChevronRight} sx={{ width: 24, height: 24, color: "text.disabled", flexShrink: 0 }} />
            }
          />
        )}
      </Grid>
    </Grid>
  );
};
