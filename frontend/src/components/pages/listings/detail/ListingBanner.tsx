import { Listing } from "@interfaces/listings";
import { Box } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  hero: {
    width: "100%",
    maxHeight: "25vh",
    height: "25vh",
  },
  background: {
    background: "url(/nth.svg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.04,
  },
}));

/**
 * Component for banner image on listing detail page.
 *
 * Props:
 * - the listing from the detail page
 */
const ListingBanner: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();
  return (
    <>
      {listing.heroImageUrl ? (
        <Box
          className={`${classes.hero}`}
          style={{
            background: `url(${listing.heroImageUrl})`,
            backgroundPosition: "top",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: 0.5,
          }}
        />
      ) : (
        <Box className={`${classes.background} ${classes.hero}`} />
      )}
    </>
  );
};

export default ListingBanner;
