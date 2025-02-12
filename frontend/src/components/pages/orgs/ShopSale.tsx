import { useMutation } from "@apollo/client";
import { Check, Clear } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { DeliveredProductDocument } from "@/generated/graphql";

type Props = {
  name: string;
  product_name: string;
  quantity: number;
  has_paid: boolean;
  is_delivered: boolean;
  order_id: string;
};

export const ShopSale: React.FC<Props> = ({ name, product_name, quantity, has_paid, is_delivered, order_id }) => {
  const theme = useTheme();
  const [delivered, setdelivered] = useState(is_delivered);
  const [deliverProduct] = useMutation(DeliveredProductDocument);


  function handle_click(bool: boolean) {
    setdelivered(bool);
    deliverProduct({ variables: { orderId: order_id } });
  }
  return (
    <Stack direction={"row"} padding={1} spacing={0} sx={{color: theme.palette.text.primary}}>
      <Box display="flex" alignItems="left" justifyContent="left" width={"25%"} padding={1}>
        <Typography variant="body1">{name}</Typography>
      </Box>
      <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
        <Typography variant="body1">{product_name}</Typography>
      </Box>
      <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
        <Typography variant="body1">Antall: {quantity}</Typography>
      </Box>
      <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
        <Typography variant="body1">Betalt: {has_paid ? "Ja" : "Nei"}</Typography>
      </Box>
      <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
        <Stack direction={"row"} spacing={1}>
          <Tooltip title="Levert">
            <Box display="inline" component="span">
              <IconButton
                color="success"
                size="large"
                disabled={delivered}
                onClick={() => {
                  handle_click(true);
                }}
              >
                <Check />
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Angre levert status Levert">
            <Box display="inline" component="span">
              <IconButton
                color="error"
                size="large"
                disabled={!delivered}
                onClick={() => {
                  handle_click(false);
                }}
              >
                <Clear />
              </IconButton>
            </Box>
          </Tooltip>
        </Stack>
      </Box>
      <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
        <Typography variant="body1">{delivered ? "Levert" : "Ikke levert"}</Typography>
      </Box>
    </Stack>
  );
};
