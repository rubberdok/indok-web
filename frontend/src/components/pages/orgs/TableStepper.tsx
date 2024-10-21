import React from 'react';
import { Button, Typography, Stack } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

type Props = {
    hasNextPage: boolean;
    page: number;
    handlePageChange: (page: number) => void;
}


export const TableStepper: React.FC<Props> = ({hasNextPage, page, handlePageChange}) => {

  const theme = useTheme();
  const nextPage = () => handlePageChange(page + 1);
  const prevPage = () => handlePageChange(page > 0 ? page - 1 : 0);

  // Check if there is a next page (if we received less than `limit` items)
  //const hasNextPage = (data?.paginatedShopOrders && data.paginatedShopOrders.length < limit) ?? false;

  return (
    <Stack
      sx={{ maxWidth: 300, flexGrow: 1, position: 'static', flexDirection: 'row', justifyContent: 'space-between' }}
    >
      <Button size="small" onClick={prevPage} disabled={page === 0}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        Back
      </Button>

      <Typography>{page + 1}</Typography>

      <Button size="small" onClick={nextPage} disabled={hasNextPage}>
        Next
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </Button>
    </Stack>
  );
};
