import { Stack } from "@mui/material";

import { Info } from "./Info";
import { Registration } from "./Registration";
import { TimeAndPlace } from "./TimeAndPlace";

export const Review: React.FC = () => {
  return (
    <Stack direction="column" spacing={2}>
      <Info />
      <TimeAndPlace />
      <Registration />
    </Stack>
  );
};
