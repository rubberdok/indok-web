import { useQuery } from "@apollo/client";
import { ResultOf } from "@graphql-typed-document-node/core";
import { Container, Grid } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { Markdown } from "@/components";
import { TitleCard } from "@/components/pages/listings/detail/TitleCard";
import { Title } from "@/components/Title";
import { graphql } from "@/gql/pages";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

const ListingDocument = graphql(`
  query ListingsPage($data: ListingInput!) {
    listing(data: $data) {
      listing {
        id
        name
        description
        applicationUrl
        closesAt
        organization {
          id
          name
        }
      }
    }
  }
`);

// page to show details about a listing and its organization
const ListingPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  listing: ssrListing,
}) => {
  const { data } = useQuery(ListingDocument, {
    variables: {
      data: { id: ssrListing.id },
    },
  });

  const descriptionWithTitle = (desc: string | undefined) => {
    if (desc === undefined) return "";
    if (!desc.startsWith("#")) {
      return "### Om vervet\n" + desc;
    }
    return desc;
  };

  const listing = data?.listing.listing;

  return (
    <>
      <Head>
        <title>{`${ssrListing.name} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}</title>
        <meta property="og:image" content="img/gang.jpg" key="image" />
        <meta
          property="og:title"
          content={`${ssrListing.name} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}
          key="title"
        />
      </Head>
      <Title
        title={listing?.name}
        overline={listing?.organization.name}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/listings", name: "Verv" },
          { href: `/listings/${listing?.id}`, name: listing?.name ?? "" },
        ]}
        ImageProps={{
          placeholder: "empty",
          unoptimized: true,
        }}
      />
      <Container sx={{ mb: 4 }}>
        <Grid
          container
          direction="row-reverse"
          justifyContent={{ xs: "center", sm: "space-between" }}
          alignItems="flex-start"
          spacing={4}
        >
          <Grid item xs={12} sm={6} md={5}>
            <TitleCard listing={listing} />
          </Grid>
          <Grid item xs={12} sm={6} md={7}>
            <Markdown>{descriptionWithTitle(listing?.description)}</Markdown>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  listing: NonNullable<ResultOf<typeof ListingDocument>["listing"]["listing"]>;
}> = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const id = Array.isArray(ctx.params?.listingId) ? ctx.params?.listingId[0] : ctx.params?.listingId;

  if (!id) return { notFound: true };

  const { data, error } = await client.query({
    query: ListingDocument,
    variables: {
      data: {
        id,
      },
    },
  });

  if (error) return { notFound: true };

  const { listing } = data.listing;
  if (!listing) return { notFound: true };

  return addApolloState(client, { props: { listing } });
};

export default ListingPage;
