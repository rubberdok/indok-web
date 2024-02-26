import { Box, Stack, Typography } from "@mui/material";

type Props = {
  name: string;
  product_name: string;
  quantity: number;
  has_paid: boolean;
  is_delivered: boolean;
};

export const ShopSale: React.FC<Props> = ({ name, product_name, quantity, has_paid, is_delivered }) => {
  return (
    <Stack direction={"row"} padding={2}>
      <Box width={"20%"} padding={1}>
        <Typography variant="body1">{name}</Typography>
      </Box>
      <Box width={"20%"} padding={1}>
        <Typography variant="body1">{product_name}</Typography>
      </Box>
      <Box width={"20%"} padding={1}>
        <Typography variant="body1">Antall: {quantity}</Typography>
      </Box>
      <Box width={"20%"} padding={1}>
        <Typography variant="body1">Betalt: {has_paid ? "Ja" : "Nei"}</Typography>
      </Box>
      <Box width={"20%"} padding={1}>
        <Typography variant="body1">Levert: {is_delivered ? "Ja" : "Nei"}</Typography>
      </Box>
    </Stack>
  );
};
