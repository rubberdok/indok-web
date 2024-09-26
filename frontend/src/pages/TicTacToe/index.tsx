'use client'
import Board from '@/components/pages/TicTacToe/Board';
import {Square} from '@/components/pages/TicTacToe/Square';
import { NextPageWithLayout } from "@/lib/next";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

const TicTacToe:NextPageWithLayout = () => {
    const router = useRouter();
    return (
        <Stack display='flex' direction='column' alignItems={'center'}>
            <Box height={'20vh'} />
            <Typography variant='h1' align='center'>
                Tic Tac Toe
            </Typography>
            <Board/>
        </Stack>

    );
    }

export default TicTacToe;
