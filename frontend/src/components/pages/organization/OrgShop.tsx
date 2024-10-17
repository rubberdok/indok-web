import { useQuery } from "@apollo/client";
import { Box, Grid, Stack, Typography, Button} from "@mui/material";
import {KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { AdminOrganizationFragment, AllShopOrdersDocument } from "@/generated/graphql";
import { ShopSale } from "../orgs/ShopSale";
import React,{ useState } from 'react';

type Props = {
  organization: AdminOrganizationFragment;
};
export const OrgProducts: React.FC<Props> = ({ organization }) => {

  const limit = 5
  const [page, setPage] = useState(0);


  const { data, error, loading } = useQuery(AllShopOrdersDocument, {
    variables: {
      limit: limit + 1,    // The number of orders you want to fetch
      offset: page * limit,    // The starting index (e.g., 0 for the first set of results)
    },
  });
  if (error) return <p>Error</p>;

  if (organization.name.toLowerCase() !== "janus linjeforening") {
    return (
      <p>
        Per nå har kun Janus tilgang på buttikk administrasjon. Etter hvert vil vi åpne for at flere kan bruke siden
      </p>
    );
  }
  if (data?.allShopOrders!.length === 0) {
    return <p>Ingen ordre</p>;
  }
    // Pagination button handlers
    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page > 0 ? page - 1 : 0);
    const theme = useTheme();
    // Check if there is a next page (if we received less than `limit` items)
    const hasNextPage = (data?.allShopOrders && data.allShopOrders.length < limit) ?? false; //Have to check if the data exists before I check that the data has a certain length. This gave me an error: data?.allShopOrders?.length < limit;

    return (
      <>

      <Stack sx={{ maxWidth: 300, flexGrow: 1, position: "static", flexDirection: "row", justifyContent: "space-between"}}>

        <Button size="small" onClick={prevPage} disabled={page === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>

        <Typography>{page + 1}</Typography>
        <Button
              size="small"
              onClick={nextPage}
              disabled={hasNextPage}
            >
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
          </Button>
      </Stack>
      <Stack direction={"row"} marginTop={"36px"} spacing = {0} padding={1} borderBottom={1} sx={{bgcolor : theme.palette.background.elevated, color: theme.palette.text.primary}}>
        <Box display="flex" alignItems="left" justifyContent="left" width={"25%"} padding={1}>
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
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          Mulige handlinger
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1"> Har vi levert varen</Typography>
        </Box>
      </Stack>
      {/*If not loading and data is loaded -> Render grid element*/}
      {(!loading && data) && <Grid container spacing={0}>
        {data?.allShopOrders?.slice(0, limit).map((order) => {
            return (
              <Grid key={order.id} item xs={12} sm={12} md={12}>
                <Stack borderBottom={1} borderColor={"gray"}>
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
          })}
      </Grid>}
    </>
  );
};
