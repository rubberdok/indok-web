import { useQuery } from "@apollo/client";
import { Box, Grid, Stack, Typography } from "@mui/material";

import { ShopSale } from "../orgs/ShopSale";

import { AdminOrganizationFragment, AllUserOrdersDocument } from "@/generated/graphql";

type Props = {
  organization: AdminOrganizationFragment;
};
export const OrgProducts: React.FC<Props> = ({ organization }) => {
  const { data, error } = useQuery(AllUserOrdersDocument);
  if (error) return <p>Error</p>;

  console.log(data);
  if (organization.name !== "Janus linjeforening") {
    return (
      <p>
        Per nå har kun Janus tilgang på buttikk administrasjon. Etter hvert vil vi åpne for at flere kan bruke siden
      </p>
    );
  }
  if (data?.allUserOrders?.length === 0) {
    return <p>Ingen ordre</p>;
  }
  return (
    <>
      <Stack direction={"row"} padding={2} border={3}>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1">Navn på kunde</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1">Kjøpt produkt</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1">Antall bestilt</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1"> Betalt status</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"25%"} padding={1}>
          Mulige handlinger
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1"> Har vi levert varen</Typography>
        </Box>
      </Stack>
      <Grid container spacing={0}>
        {data?.allUserOrders?.map((order) => {
          if (order.product.shopItem === true) {
            return (
              <Grid key={order.id} item xs={12} sm={12} md={12}>
                <Stack border={1}>
                  <ShopSale
                    name={order.user.firstName + " " + order.user.lastName}
                    product_name={order.product.name}
                    quantity={order.quantity}
                    has_paid={order.paymentStatus === "CAPTURED"}
                    is_delivered={order.deliveredProduct === true}
                    order_id={order.id}
                  />
                </Stack>
              </Grid>
            );
          }
        })}
      </Grid>
    </>
  );
};
