import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import Link from "next/link";
import Content from "@components/ui/Content";
import { Title, SubTitle, Paragraph } from "@components/ui/Typography";
import Apply from "@components/pages/listings/apply";

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { ID: Number(listingID[0]) },
  });
  if (error) return <h1>Error</h1>;
  if (loading) return <h1>Loading...</h1>;
  return (
    <>
      {data && (
        <Layout>
          <Content>
            <Link href={`/listings`}>Tilbake</Link>
            <Title>{data.listing.title}</Title>
            <SubTitle>{data.listing.organization?.name}</SubTitle>
            <Paragraph>{data.listing.description}</Paragraph>
            <p>Frist: {data.listing.deadline.slice(0, 16).replace("T", " ")}</p>
            <Apply listing={data.listing} />
          </Content>
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
