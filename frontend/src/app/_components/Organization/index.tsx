import { Card, CardActionArea, CardContent, CardMedia, CardProps, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { NextLinkComposed } from "@/app/components/Link";
import React from "react";
import { DefaultLogo } from "./DefaultLogo";

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
  link?: string;
} & CardProps;

function Organization({ organization, link, children, ...cardProps }: React.PropsWithChildren<Props>) {
  return (
    <Card sx={{ height: 1 }} {...cardProps}>
      <OrganizationCardActionArea link={link}>
        <Stack direction="row" justifyContent="center" pt={1}>
          <CardMedia
            sx={{
              height: "150px",
              width: "150px",
              position: "relative",
              borderRadius: "100%",
              overflow: "hidden",
            }}
          >
            {organization.logo?.url && (
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
            )}
            <Stack alignItems="center" justifyContent="center" bgcolor="white" height={1} width={1}>
              {!organization.logo?.url && <DefaultLogo />}
            </Stack>
          </CardMedia>
        </Stack>
        <CardContent>
          <Stack direction="column" alignItems="center">
            <Typography variant="subtitle1" textAlign="center">
              {organization.name}
            </Typography>
            <Typography variant="caption" textAlign="center">
              {organization.slogan}
            </Typography>
          </Stack>
          {children}
        </CardContent>
      </OrganizationCardActionArea>
    </Card>
  );
}

export { Organization };

function OrganizationCardActionArea({ link, children }: React.PropsWithChildren<{ link?: string }>) {
  if (link) {
    return (
      <CardActionArea component={NextLinkComposed} to={link} sx={{ height: 1 }}>
        {children}
      </CardActionArea>
    );
  }
  return <>{children}</>;
}
