import { useQuery } from "@apollo/client";
import { Grid, Stack } from "@mui/material";

import { ShopSale } from "../orgs/ShopSale";

import { AdminOrganizationFragment, UserOrdersDocument } from "@/generated/graphql";

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
                />
              </Stack>
            </Grid>
          );
        }
      })}
    </Grid>
  );
};
