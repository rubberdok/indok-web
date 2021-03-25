import { Listing } from "@interfaces/listings";
import { Box, makeStyles } from "@material-ui/core";

interface BannerProps {
  listing: Listing;
}

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

const Banner: React.FC<BannerProps> = ({ listing }) => {
  const classes = useStyles();
  return (
    <>
      {listing.hero ? (
        <Box
          className={`${classes.hero}`}
          style={{
            background: `url(${listing.hero})`,
            backgroundPosition: "center",
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

export default Banner;
