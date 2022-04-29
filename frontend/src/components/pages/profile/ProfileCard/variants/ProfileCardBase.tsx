import { Button, Card, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  actionText?: string;
  actionLink?: string;
  image?: StaticImageData;
  alt?: string;
  "data-test-id"?: string;
};

const ProfileCardBase: React.FC<Props> = ({
  title,
  children,
  actionText,
  actionLink,
  image,
  alt,
  "data-test-id": dataTestId,
}) => {
  return (
    <Card sx={{ height: 1 }}>
      <Grid container direction="row" alignItems="center" sx={{ height: 1 }}>
        <Grid container item xs sx={{ height: 1 }} direction="column" justifyContent="space-between">
          <CardHeader title={title} />
          <CardContent>{children}</CardContent>
          {actionText && actionLink && (
            <CardActions data-test-id={`${dataTestId}link`} sx={{ ml: 2, mb: 2 }}>
              <Link passHref href={actionLink}>
                <Button color="inherit" variant="outlined">
                  {actionText}
                </Button>
              </Link>
            </CardActions>
          )}
        </Grid>
        {image && (
          <Grid item xs={3} sx={{ mr: 4 }}>
            <Image src={image} layout="responsive" objectFit="contain" alt={alt} />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default ProfileCardBase;
