import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import TextField from "@components/pages/surveys/formComponents/textfield";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import Link from "next/link";
import CreateResponse from "@components/pages/listings/createResponse";
import Content from "@components/ui/Content";
import { Title, SubTitle, Paragraph } from "@components/ui/Typography";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
  const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
    variables: { ID: Number(listingID[0]) },
  });
  const { loading: userLoading, error: userError, data: userData } = useQuery<{ user: User }>(GET_USER);
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
            {userLoading || userError || !userData || !userData.user ? (
              <p>Logg inn for å søke!</p>
            ) : (
              <CreateResponse listing={data.listing} applicantID={userData.user.id}>
                <TextField title="Søk:" placeholder="Din søknad..." size="long" />
              </CreateResponse>
            )}
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
