import OrganizationListings from "@components/pages/listings/organization/organizationListings";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { ORGANIZATION_FROM_SLUG } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";
import CreateListing from "@components/pages/listings/organization/createListing";
import Link from "next/link";
import Layout from "@components/Layout";

const OrganizationPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ orgSlug }) => {
  const { loading, error, data } = useQuery<{ organization: Organization }>(ORGANIZATION_FROM_SLUG, {
    variables: {
      slug: orgSlug,
    },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <Link href="/organizations">Tilbake</Link>
      {data && (
        <>
          <div>
            <h3>{data.organization.name}</h3>
          </div>
          <div>{data.organization.description}</div>
          <h4>Åpne verv:</h4>
          <OrganizationListings organization={data.organization} />
          <h4>Opprett verv:</h4>
          <CreateListing organization={data.organization} />
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{ orgSlug: string }> = async (context) => {
  console.log(context.query);
  const orgSlug = context.query.orgSlug as string;
  return {
    props: { orgSlug },
  };
};

export default OrganizationPage;
