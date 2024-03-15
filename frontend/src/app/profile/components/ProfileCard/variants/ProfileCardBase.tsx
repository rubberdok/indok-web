import { Button, Card, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import Image, { StaticImageData } from "next/image";

import { Link } from "@/app/components/Link";

type Props = {
  title: string;
  actionText?: string;
  actionLink?: string;
  image?: StaticImageData;
  alt?: string;
  "data-test-id"?: string;
};

export const ProfileCardBase: React.FC<React.PropsWithChildren<Props>> = ({
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
            <CardActions>
              <Button
                component={Link}
                noLinkStyle
                href={actionLink}
                color="secondary"
                variant="text"
                data-test-id={`${dataTestId}link`}
              >
                {actionText}
              </Button>
            </CardActions>
          )}
        </Grid>
        {image && (
          <Grid item xs={3} sx={{ mr: 4 }}>
            <Image src={image} style={{ objectFit: "contain", width: "100%", height: "100%" }} alt={alt ?? ""} />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};
