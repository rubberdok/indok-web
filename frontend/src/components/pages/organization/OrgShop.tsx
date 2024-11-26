import { useQuery } from "@apollo/client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { AdminOrganizationFragment, PaginatedShopOrdersDocument } from "@/generated/graphql";
import { ShopSale } from "../orgs/ShopSale";
import { TableStepper } from "../orgs/TableStepper";
import { HEADER_DESKTOP_HEIGHT} from "@/lib/mui/theme/constants";

type Props = {
  organization: AdminOrganizationFragment;
};
export const OrgProducts: React.FC<Props> = ({ organization }) => {
  const theme = useTheme();
  const limit = 100;
  const [page, setPage] = useState(0);

  const handlePageChange = (newValue: number) => {
    setPage(newValue);
  };

  const { data, error, loading } = useQuery(PaginatedShopOrdersDocument, {
    variables: {
      limit: limit + 1, // The number of orders you want to fetch
      offset: page * limit, // The starting index (e.g., 0 for the first set of results)
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
  if (data?.paginatedShopOrders!.length === 0) {
    return <p>Ingen ordre</p>;
  }
  // Check if there is a next page (if we received less than `limit` items)
  const hasNextPage = (data?.paginatedShopOrders && data.paginatedShopOrders.length < limit) ?? false;

  return (
    <>
      <TableStepper page={page} hasNextPage={hasNextPage} handlePageChange={handlePageChange} />
      <Stack
        direction={"row"}
        marginTop={"36px"}
        spacing={0}
        padding={1}
        borderBottom={1}
        position={"sticky"}
        sx={{ bgcolor: theme.palette.background.elevated, color: theme.palette.text.primary, top: HEADER_DESKTOP_HEIGHT - 20, zIndex:1}}
      >
        <Box display="flex" alignItems="left" justifyContent="left" width={"25%"} padding={1}>
          <Typography variant="body1" fontWeight={"bold"}>Navn på kunde</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1" fontWeight={"bold"}>Kjøpt produkt</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1" fontWeight={"bold"}>Antall bestilt</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1" fontWeight={"bold"}>Betalt status</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography fontWeight={"bold"}>Mulige handlinger</Typography>
        </Box>
        <Box display="flex" alignItems="left" justifyContent="left" width={"15%"} padding={1}>
          <Typography variant="body1" fontWeight={"bold"}>Har vi levert varen</Typography>
        </Box>
      </Stack>

      {loading ? (
        <Typography padding={1}>Loading...</Typography>
      ) : (
        data && (
          <>
            <Grid container spacing={0}>
              {data?.paginatedShopOrders?.slice(0, limit).map((order, index) => {
                return (
                  <Grid key={order.id} item xs={12} sm={12} md={12}>
                    <Stack
                    borderBottom={1}
                    borderColor={"gray"}
                    sx={{
                      bgcolor: index % 2 === 0 ? theme.palette.background.paper : theme.palette.background.elevated,
                    }}
                    >
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
            </Grid>

            <Stack marginTop={"18px"}>
              <TableStepper page={page} hasNextPage={hasNextPage} handlePageChange={handlePageChange} />
            </Stack>
          </>
        )
      )}
    </>
  );
};
