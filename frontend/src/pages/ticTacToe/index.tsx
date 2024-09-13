"use client";

import Board from "@/components/pages/ticTacToe/Board";
import Square from "@/components/pages/ticTacToe/Square";
import { NextPageWithLayout } from "@/lib/next";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

const TicTacToe: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <Stack direction={"column"} alignItems={"center"}>
      <Box height={"20vh"}></Box>
      <Typography variant="h1" align="center">
        Tic Tac Toe
      </Typography>
      <Board />
    </Stack>
  );
};

export default TicTacToe;
