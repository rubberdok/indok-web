import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { Container } from "@mui/material";

export default async function Layout({
  children,
  params,
  searchParams,
}: React.PropsWithChildren<{ params: { orderId: string }; searchParams?: { reference?: string } }>) {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query ReceiptLayout_Order($data: OrderInput!) {
        order(data: $data) {
          order {
            id
            product {
              name
            }
          }
        }
      }
    `),
    variables: {
      data: {
        id: params.orderId,
      },
    },
  });
  let href = `/receipt/${params.orderId}`;
  if (searchParams?.reference) {
    href += `?reference=${searchParams.reference}`;
  }

  return (
    <Container>
      <Breadcrumbs
        links={[
          { name: "Hjem", href: "/" },
          {
            name: `Kvittering for ${data.order.order.product.name}`,
            href,
          },
        ]}
      />
      <Container maxWidth="sm" disableGutters>
        {children}
      </Container>
    </Container>
  );
}
