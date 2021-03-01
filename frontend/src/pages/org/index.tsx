import { NextPage } from "next";
import CreateOrganization from "@components/pages/listings/organization/createOrganization";
import { useQuery } from "@apollo/client";
import { ORGANIZATIONS } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";
import Link from "next/link";
import Layout from "@components/Layout";

const OrganizationsPage: NextPage = () => {
  //TODO: change allOrganizations to organizations
  const { loading, error, data } = useQuery<{ allOrganizations: Organization[] }>(ORGANIZATIONS);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <Layout>
      <h3>Demoside for å logge inn i forening</h3>
      {data &&
        data.allOrganizations.map((org) => (
          <div key={org.id}>
            <Link href={`/org/${org.id}`}>{org.name}</Link>
          </div>
        ))}
      <h4>Opprett ny forening</h4>
      <CreateOrganization />
    </Layout>
  );
};

export default OrganizationsPage;
