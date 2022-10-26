import { Box } from "@mui/material";

type Props = {
  /** URL on the listing for the image to display in the banner. */
  imageUrl?: string | null;
};

/** Component for banner image on listing detail page. */
export const ListingBanner: React.FC<React.PropsWithChildren<Props>> = ({ imageUrl }) => {
  return (
    <>
      {imageUrl ? (
        <Box
          sx={{
            background: `url(${imageUrl})`,
            backgroundPosition: "top",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: 0.5,
            width: "100%",
            maxHeight: "25vh",
            height: "25vh",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            maxHeight: "25vh",
            height: "25vh",
            background: "url(/nth.svg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.04,
          }}
        />
      )}
    </>
  );
};
