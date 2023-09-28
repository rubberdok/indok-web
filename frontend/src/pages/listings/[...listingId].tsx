import { useQuery } from "@apollo/client";
import { ResultOf } from "@graphql-typed-document-node/core";
import { Container, Grid } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { Markdown } from "@/components";
import { TitleCard } from "@/components/pages/listings/detail/TitleCard";
import { Title } from "@/components/Title";
import { ListingDocument } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

// page to show details about a listing and its organization
const ListingPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listing }) => {
  const { data } = useQuery(ListingDocument, {
    variables: {
      id: listing.id,
    },
  });

  const descriptionWithTitle = (desc: string | undefined) => {
    if (desc === undefined) return "";
    if (!desc.startsWith("#")) {
      return "### Om vervet\n" + desc;
    }
    return desc;
  };

  return (
    <>
      <Head>
        <title>{`${listing.title} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}</title>
        <meta property="og:image" content="img/gang.jpg" key="image" />
        {listing.organization.logoUrl && (
          <meta property="og:image" content={listing.organization.logoUrl} key="image" />
        )}
        {listing.heroImageUrl && <meta property="og:image" content={listing.heroImageUrl} key="image" />}
        <meta
          property="og:title"
          content={`${listing.title} | Foreningen for Studenter ved Industriell Økonomi og Teknologiledelse`}
          key="title"
        />
      </Head>
      <Title
        title={data?.listing?.title}
        variant={data?.listing?.heroImageUrl ? "dark" : "normal"}
        overline={data?.listing?.organization.name}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/listings", name: "Verv" },
          { href: `/listings/${data?.listing?.id}`, name: data?.listing?.title ?? "" },
        ]}
        bgImage={data?.listing?.heroImageUrl ?? undefined}
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
            <TitleCard listing={data?.listing ?? undefined} />
          </Grid>
          <Grid item xs={12} sm={6} md={7}>
            <Markdown>{descriptionWithTitle(data?.listing?.description)}</Markdown>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  listing: NonNullable<ResultOf<typeof ListingDocument>["listing"]>;
}> = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const id = Array.isArray(ctx.params?.listingId) ? ctx.params?.listingId[0] : ctx.params?.listingId;

  if (!id) return { notFound: true };

  const { data, error } = await client.query({
    query: ListingDocument,
    variables: {
      id,
    },
  });

  if (error) return { notFound: true };

  const { listing } = data;
  if (!listing) return { notFound: true };

  return addApolloState(client, { props: { listing } });
};

export default ListingPage;
