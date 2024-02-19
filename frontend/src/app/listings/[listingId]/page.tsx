import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { Metadata } from "next";
import { Listing } from "./components/Listing";

export async function generateMetadata({ params }: { params: { listingId: string } }): Promise<Metadata> {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query ListingMetadata($data: ListingInput!) {
        listing(data: $data) {
          listing {
            id
            name
            description
          }
        }
      }
    `),
    variables: {
      data: {
        id: params.listingId,
      },
    },
  });

  return {
    title: data.listing.listing.name,
    description: data.listing.listing.description,
  };
}

export default function Page({ params }: { params: { listingId: string } }) {
  return <Listing params={params} />;
}
