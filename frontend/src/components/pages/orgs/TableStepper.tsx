import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { Button, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

type Props = {
  hasNextPage: boolean;
  page: number;
  handlePageChange: (page: number) => void;
};

export const TableStepper: React.FC<Props> = ({ hasNextPage, page, handlePageChange }) => {
  const theme = useTheme();
  const nextPage = () => handlePageChange(page + 1);
  const prevPage = () => handlePageChange(page > 0 ? page - 1 : 0);
  const resetPage = () => handlePageChange(0)

  return (
    <Stack
      sx={{ maxWidth: 300, flexGrow: 1, position: "static", flexDirection: "row", justifyContent: "space-between" }}
    >
      <Stack sx ={{flexDirection: "row"}}>
        <Button size="small" onClick={resetPage} disabled={page === 0}>
          {theme.direction === "rtl" ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
          First
        </Button>
        <Button size="small" onClick={prevPage} disabled={page === 0}>
          {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          Back
        </Button>
      </Stack>

      <Typography>{page + 1}</Typography>

      <Button size="small" onClick={nextPage} disabled={hasNextPage}>
        Next
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </Button>
    </Stack>
  );
};
