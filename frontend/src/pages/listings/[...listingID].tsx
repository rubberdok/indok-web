import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import Link from "next/link";
import Apply from "@components/pages/listings/apply";

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { ID: Number(listingID[0]) },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <Layout>
          <Link href={`/listings`}>Tilbake</Link>
          <h1>{data.listing.title}</h1>
          <h3>{data.listing.organization?.name}</h3>
          <p>{data.listing.description}</p>
          <p>Frist: {data.listing.deadline.slice(0, 16).replace("T", " ")}</p>
          <Apply listing={data.listing} />
        </Layout>
      )}
    </>
  );
};

export default ListingPage;

export const getServerSideProps: GetServerSideProps<{ listingID: string }> = async (context) => {
  const listingID = context.query.listingID as string;
  return {
    props: { listingID },
  };
};
