import { getBlurUrl } from "@lib/cloudinary";
import { Grid, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";

type Props = {
  name: string;
  position?: string;
  email?: string;
  image?: StaticImageData;
};

const ContactInfo: React.VFC<Props> = ({ name, position, email, image }) => {
  const nameAndPosition = `${name}${position ? ` - ${position}` : ""}`;
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        sx={{
          borderRadius: "50%",
          // aspectRatio: "1 / 1",
          overflow: "hidden",
          marginBottom: (theme) => theme.spacing(2),
          backgroundColor: (theme) => theme.palette.primary.light,
          /* Replace the below when MacOS 15 arrives */
          paddingTop: "40%",
          position: "relative" /* If you want text inside of it */,
          width: "40%",
        }}
      >
        {image && (
          <Image
            src={image}
            blurDataURL={getBlurUrl(image.src)}
            placeholder="blur"
            layout="fill"
            objectPosition="center"
            objectFit="cover"
          />
        )}
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
