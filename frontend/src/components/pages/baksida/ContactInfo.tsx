import { Grid, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/future/image";

type Props = {
  name: string;
  position?: string;
  email?: string;
  image?: StaticImageData;
};

export const ContactInfo: React.VFC<Props> = ({ name, position, email, image }) => {
  const nameAndPosition = `${name}${position ? ` - ${position}` : ""}`;
  return (
    <Grid item container direction="column" justifyContent="space-between" alignItems="center">
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        sx={{
          borderRadius: "50%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          marginBottom: (theme) => theme.spacing(2),
          backgroundColor: (theme) => theme.palette.primary.light,
          position: "relative" /* If you want text inside of it */,
        }}
      >
        {image && (
          <Image src={image} alt="" placeholder="blur" fill style={{ objectPosition: "center", objectFit: "cover" }} />
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
