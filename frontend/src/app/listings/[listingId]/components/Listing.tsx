"use client";

import { useSuspenseQuery } from "@apollo/client";
import { Unstable_Grid2 as Grid } from "@mui/material";

import { Markdown } from "@/components";
import { graphql } from "@/gql/app";

import { TitleCard } from "./TitleCard";

type Props = {
  params: { listingId: string };
};

const ListingQuery = graphql(`
  query ListingPage_Query($data: ListingInput!) {
    listing(data: $data) {
      listing {
        id
        description
        ...TitleCard_Listing
      }
    }
  }
`);

function Listing({ params }: Props) {
  const { data } = useSuspenseQuery(ListingQuery, { variables: { data: { id: params.listingId } } });
  return (
    <>
      <Grid
        container
        direction="row-reverse"
        justifyContent={{ xs: "center", sm: "space-between" }}
        alignItems="flex-start"
        spacing={4}
      >
        <Grid xs={12} sm={6} md={5}>
          <TitleCard listing={data.listing.listing} />
        </Grid>
        <Grid xs={12} sm={6} md={7}>
          <Markdown>{descriptionWithTitle(data.listing.listing.description)}</Markdown>
        </Grid>
      </Grid>
    </>
  );
}

function descriptionWithTitle(desc: string | undefined) {
  if (desc === undefined) return "";
  if (!desc.startsWith("#")) {
    return "### Om vervet\n" + desc;
  }
  return desc;
}

export { Listing };
