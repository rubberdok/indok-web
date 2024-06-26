import { Grid, Typography } from "@mui/material";
import Image, { type StaticImageData } from "next/image";

import { Link } from "../components/Link";

type Props = {
  name: string;
  position?: string;
  email?: string;
  image?: StaticImageData;
};

export const ContactInfo: React.FC<Props> = ({ name, position, email, image }) => {
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
          marginBottom: 2,
          backgroundColor: "primary.light",
          position: "relative" /* If you want text inside of it */,
        }}
      >
        {image && (
          <Image src={image} alt="" placeholder="blur" fill style={{ objectPosition: "center", objectFit: "cover" }} />
        )}
      </Grid>
      <Grid item md>
        <Typography variant="subtitle2">
          {name}
          {position && ` - ${position}`}
        </Typography>
      </Grid>
      {email && (
        <Grid item md>
          <Link variant="overline" href={`mailto:${email}`}>
            {email}
          </Link>
        </Grid>
      )}
    </Grid>
  );
};
