import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { NextLinkComposed } from "@/app/components/Link";

export type Organization = {
  id: string;
  name: string;
  link?: string;
  slogan?: string;
  logo?: {
    url?: string | null;
  } | null;
};

type Props = {
  organization: Organization;
  link: string;
};

function Organization({ organization, link }: Props) {
  return (
    <Card sx={{ height: 1 }}>
      <CardActionArea sx={{ height: 1 }} component={NextLinkComposed} to={link}>
        {organization.logo?.url && (
          <Stack direction="row" justifyContent="center" pt={1}>
            <CardMedia
              sx={{
                aspectRatio: 1,
                width: "50%",
                position: "relative",
                borderRadius: "100%",
                overflow: "hidden",
              }}
            >
              <Image
                src={organization.logo?.url}
                alt={organization.name}
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                unoptimized
              />
            </CardMedia>
          </Stack>
        )}
        <CardContent>
          <Stack direction="column" alignItems="center">
            <Typography variant="subtitle1" textAlign="center">
              {organization.name}
            </Typography>
            <Typography variant="caption" textAlign="center">
              {organization.slogan}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export { Organization };
