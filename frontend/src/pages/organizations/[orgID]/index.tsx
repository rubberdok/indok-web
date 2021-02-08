import OrganizationListings from "@components/pages/listings/organization/organizationListings";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { ORGANIZATION } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";
import CreateListing from "@components/pages/listings/organization/createListing";
import Link from "next/link";
import Layout from "@components/Layout";

const OrganizationPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ orgID }) => {
  const { loading, error, data } = useQuery<{ organization: Organization }>(ORGANIZATION, {
    variables: {
      ID: orgID,
    },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <Link href="/organizations">
        <a>Tilbake</a>
      </Link>
      {data && (
        <>
          <div>
            <h3>{data.organization.name}</h3>
          </div>
          <div>{data.organization.description}</div>
          <Link href={`/organizations/${orgID}/listings`}>
            <a>Verv</a>
          </Link>
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{ orgID: string }> = async (context) => {
  console.log(context.query);
  const orgID = context.query.orgID as string;
  return {
    props: { orgID },
  };
};

export default OrganizationPage;
