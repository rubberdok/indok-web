import { Box, ButtonBase, Stack } from "@mui/material";
import { useState } from "react";
import Square from "./Square";

type Props = {};

export const Board: React.VFC<Props> = ({}) => {
  return (
    <Box>
      <Stack direction={"row"}>
        <Square />
        <Square />
        <Square />
      </Stack>
      <Stack direction={"row"}>
        <Square />
        <Square />
        <Square />
      </Stack>
      <Stack direction={"row"}>
        <Square />
        <Square />
        <Square />
      </Stack>
    </Box>
  );
};
export default Board;
