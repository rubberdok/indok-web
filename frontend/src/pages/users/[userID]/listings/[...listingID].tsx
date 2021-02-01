import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import TextField from "@components/pages/surveys/formComponents/textfield";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import Link from "next/link";
import CreateResponse from "@components/pages/listings/createResponse";
import NavBar from "@components/navbar/Navbar";
import Content from "@components/ui/Content";
import { Title, SubTitle, SubHeading, Paragraph } from "@components/ui/Typography";
import Button from "@components/ui/Button";

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ userID, listingID }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { ID: Number(listingID[0]) },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <Layout>
          <Content>
            <Link href={`/users/${userID}/listings`}>Tilbake</Link>
            <Title>{data.listing.title}</Title>
            <SubTitle>{data.listing.organization?.name}</SubTitle>
            <Paragraph>{data.listing.description}</Paragraph>
            <p>Frist: {data.listing.deadline.slice(0, 16).replace("T", " ")}</p>
            <CreateResponse listing={data.listing} applicantID={userID}>
              <TextField title="Søk:" placeholder="Din søknad..." size="long" />
            </CreateResponse>
          </Content>
        </Layout>
      )}
    </>
  );
};

export default ListingPage;

export const getServerSideProps: GetServerSideProps<{ userID: string; listingID: string }> = async (context) => {
  const listingID = context.query.listingID as string;
  const userID = context.query.userID as string;
  return {
    props: { userID, listingID },
  };
};

/*TODO: Implement getStaticPaths/getStaticProps
export const getStaticPaths: GetStaticPaths = async () => {
    const { error, data } = useQuery(ALL_LISTING_IDS);
    if (error) {
        console.log("Error fetching listing IDs");
    }
    const paths: string[] = data.allListings.map((listing: Listing) => ({
        params: { id: listing.id },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const listingData = useQuery(LISTING_BY_ID, { variables: { id: params?.id as string } });
    return {
        props: {
            listingData,
        },
    };
}; */
