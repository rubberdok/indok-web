import { OpenInNew } from "@mui/icons-material";
import { Box, Card, CardActionArea, Stack, Typography } from "@mui/material";

import { NextLinkComposed } from "@/components";

type External = {
  externalUrl: string;
  internalUrl?: never;
};

type Internal = {
  internalUrl: string;
  externalUrl?: never;
};

export type Organization = {
  name: string;
} & (External | Internal);

type Props = {
  organization: Organization;
};

export const OrganizationLink: React.FC<Props> = ({ organization }) => {
  return (
    <Card elevation={6}>
      <CardActionArea
        sx={{ px: 4, py: 3 }}
        component={NextLinkComposed}
        to={organization.externalUrl ?? organization.internalUrl}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              opacity: organization.externalUrl ? 1 : 0.44,
              bgcolor: "primary.main",
            }}
          />
          <Typography variant="h6" component="p" noWrap>
            {organization.name}
          </Typography>
          {organization.externalUrl && <OpenInNew fontSize="small" />}
        </Stack>
      </CardActionArea>
    </Card>
  );
};
