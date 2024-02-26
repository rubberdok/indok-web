import { useQuery } from "@apollo/client";
import { Box, Grid, Stack, Typography } from "@mui/material";

import { AdminOrganizationFragment, UserOrdersDocument } from "@/generated/graphql";

import { ShopSale } from "../orgs/ShopSale";

type Props = {
  organization: AdminOrganizationFragment;
};
export const OrgProducts: React.FC<Props> = ({ organization }) => {
  const { data, error } = useQuery(UserOrdersDocument);
  if (error) return <p>Error</p>;

  console.log(data);
  if ("24" !== organization.id) {
    //Janus har ID 16
    return (
      <p>
        Per nå har kun Janus tilgang på buttikk administrasjon. Etter hvert vil vi åpne for at flere kan bruke siden
      </p>
    );
  }
  if (data?.userOrders?.length === 0) {
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
        {data?.userOrders?.map((order) => {
          if (order.product.shopItem === true) {
            return (
              <Grid key={order.id} item xs={12} sm={12} md={12}>
                <Stack border={1}>
                  <ShopSale
                    name={order.user.firstName + " " + order.user.lastName}
                    product_name={order.product.name}
                    quantity={order.quantity}
                    has_paid={order.paymentStatus === "CAPTURED"}
                    is_delivered={order.delivered}
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
