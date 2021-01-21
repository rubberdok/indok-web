import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import AllListings from "@components/pages/listings/allListings";
import { Title } from "@components/ui/Typography";
import Content from "@components/ui/Content";

const ListingsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ userID }) => {
  return (
    <Layout>
      <Content>
        <Link href="/users">Tilbake</Link>
        <Title>Åpne verv</Title>
        <AllListings userID={userID} />
      </Content>
    </Layout>
  );
};

//temporary implementation of user
export const getServerSideProps: GetServerSideProps<{ userID: string }> = async (context) => {
  const userID = context.query.userID as string;
  return {
    props: { userID },
  };
};

export default ListingsPage;
