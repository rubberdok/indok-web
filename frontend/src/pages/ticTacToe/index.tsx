"use client";

import Board from "@/components/pages/ticTacToe/Board";
import MoveHistory from "@/components/pages/ticTacToe/MoveHistory";
import { NextPageWithLayout } from "@/lib/next";
import { Box, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";

const TicTacToe: NextPageWithLayout = () => {
  const [winner, setWinner] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [squares, setSquares] = useState<string[]>(Array(9).fill(""));
  const [history, setHistory] = useState<string[][]>([squares]);
  const [turn, setTurn] = useState<string>("X");
  const currentlyViewing = useRef(history.length - 1);

  function isGameOver(currentSquares: string[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (currentSquares[a] && currentSquares[a] === currentSquares[b] && currentSquares[a] === currentSquares[c]) {
        setWinner(currentSquares[a]);
        setGameOver(true);
      }
    }
    if (currentSquares.every((currentSquares) => currentSquares !== "")) {
      setGameOver(true);
    }
  }

  function handleMove(i: number) {
    console.log(currentlyViewing.current);
    console.log(history.length - 1);
    if (currentlyViewing.current !== history.length - 1) {
      jumpTo(history.length - 1);
      return;
    }
    if (gameOver === true) {
      return;
    }
    if (squares[i] === "") {
      const newSquares = squares.slice();
      newSquares[i] = turn;
      setSquares(newSquares);
      if (turn === "X") {
        setTurn("O");
      } else {
        setTurn("X");
      }
      isGameOver(newSquares);
      history.push(newSquares);
      currentlyViewing.current = history.length - 1;
    }
    console.log(currentlyViewing.current);
  }

  function jumpTo(step: number) {
    setSquares(history[step]);
    currentlyViewing.current = step;
  }

  return (
    <Stack direction={"column"} alignItems={"center"}>
      <Box height={"20vh"}></Box>
      <Typography variant="h1" align="center">
        Tic Tac Toe
      </Typography>
      <Typography variant="h3" align="center">
        {gameOver ? gameOverMessage() : ""}
      </Typography>
      <Stack direction={"row"} spacing={1}>
        <Board squares={squares} handleMove={handleMove} />
        <MoveHistory history={history} jumpTo={jumpTo} currentlyViewing={currentlyViewing.current} />
      </Stack>
    </Stack>
  );

  function gameOverMessage() {
    if (gameOver && winner === "") {
      return "Draw!";
    } else if (winner !== "") {
      return `${winner} wins!`;
    }
  }
};

export default TicTacToe;
