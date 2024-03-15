"use client";
import { useSuspenseQuery } from "@apollo/client";

import { graphql } from "@/gql/app";

import { Listings } from "./components/Listings";

export default function Page() {
  const { data } = useSuspenseQuery(
    graphql(`
      query ListingsPage_Query {
        ...Listings_Query
      }
    `)
  );

  return <Listings query={data} />;
}
