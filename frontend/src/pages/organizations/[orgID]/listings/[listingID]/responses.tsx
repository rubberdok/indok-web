import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTING } from "@graphql/listings/queries";
import ListingResponses from "@components/pages/listings/organization/listingResponses";
import Link from "next/link";
import Layout from "@components/Layout";

const ListingResponsesPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  listingID,
  orgID,
}) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: {
      ID: listingID,
    },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading</p>;
  return (
    <Layout>
      {data && (
        <>
          <Link href={`/org/${orgID}/listings`}>Tilbake</Link>
          <ListingResponses listing={data.listing} />
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  listingID: string;
  orgID: string;
}> = async (context) => {
  const listingID = context.query.listingID as string;
  const orgID = context.query.orgID as string;
  return {
    props: { listingID, orgID },
  };
};

export default ListingResponsesPage;
