import { Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Image, { StaticImageData } from "next/image";

const useStyles = makeStyles((theme) => ({
  img: {
    borderRadius: "50%",
    // aspectRatio: "1 / 1",
    overflow: "hidden",
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    /* Replace the below when MacOS 15 arrives */
    paddingTop: "40%",
    position: "relative" /* If you want text inside of it */,
    width: "40%",
  },
}));

type Props = {
  name: string;
  position?: string;
  email?: string;
  image?: StaticImageData;
};

const ContactInfo: React.VFC<Props> = ({ name, position, email, image }) => {
  const classes = useStyles();
  const nameAndPosition = `${name}${position ? ` - ${position}` : ""}`;
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid item container direction="row" justifyContent="center" className={classes.img}>
        {image && <Image src={image} placeholder="blur" layout="fill" objectPosition="center" objectFit="cover" />}
      </Grid>
      <Grid item md>
        <Typography variant="subtitle2">{nameAndPosition}</Typography>
      </Grid>
      {email && (
        <Grid item md>
          <a href={`mailto:${email}`}>
            <Typography variant="overline">{email}</Typography>
          </a>
        </Grid>
      )}
    </Grid>
  );
};

export default ContactInfo;
