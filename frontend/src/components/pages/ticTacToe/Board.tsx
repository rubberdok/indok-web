import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Square from "./Square";

type Props = {
  squares: string[];
  handleMove: (i: number) => void;
};

export const Board: React.VFC<Props> = ({ squares, handleMove }) => {
  return (
    <Box>
      <Stack direction={"row"}>
        <Square index={0} value={squares[0]} handleClick={handleMove} />
        <Square index={1} value={squares[1]} handleClick={handleMove} />
        <Square index={2} value={squares[2]} handleClick={handleMove} />
      </Stack>
      <Stack direction={"row"}>
        <Square index={3} value={squares[3]} handleClick={handleMove} />
        <Square index={4} value={squares[4]} handleClick={handleMove} />
        <Square index={5} value={squares[5]} handleClick={handleMove} />
      </Stack>
      <Stack direction={"row"}>
        <Square index={6} value={squares[6]} handleClick={handleMove} />
        <Square index={7} value={squares[7]} handleClick={handleMove} />
        <Square index={8} value={squares[8]} handleClick={handleMove} />
      </Stack>
    </Box>
  );
};
export default Board;
