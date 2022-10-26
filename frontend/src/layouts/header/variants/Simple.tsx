import { Box, Divider, Stack } from "@mui/material";

import { Logo } from "../../../components";

export const Simple: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider orientation="vertical" sx={{ height: 24 }} />}
        spacing={3}
      >
        <Logo />
      </Stack>
    </Box>
  );
};
