"use client";
import { useSuspenseQuery } from "@apollo/client";
import { Container } from "@mui/material";

import { Title } from "@/components/Title";
import { graphql } from "@/gql/app";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

export default function Layout({ params, children }: React.PropsWithChildren<{ params: { listingId: string } }>) {
  const { data } = useSuspenseQuery(
    graphql(`
      query ListingLayout_Query($data: ListingInput!) {
        listing(data: $data) {
          listing {
            id
            name
            organization {
              id
              name
            }
          }
        }
      }
    `),
    { variables: { data: { id: params.listingId } } }
  );

  return (
    <>
      <Title
        title={data.listing.listing.name}
        overline={data.listing.listing.organization.name}
        sx={{ mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` } }}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/listings", name: "Verv" },
          { href: `/listings/${data.listing.listing.id}`, name: data.listing.listing.name },
        ]}
      />
      <Container>{children}</Container>
    </>
  );
}
