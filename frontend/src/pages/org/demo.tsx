import { NextPage } from "next";
import CreateOrganization from "@components/pages/listings/organization/createOrganization";
import { useQuery } from "@apollo/client";
import { ORGANIZATIONS } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";
import Link from "next/link";

const Demo: NextPage = () => {
    //TODO: change allOrganizations to organizations
    const { loading, error, data } = useQuery<{ allOrganizations: Organization[] }>(ORGANIZATIONS);
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <>
            <CreateOrganization />
            <br />
            {data &&
                data.allOrganizations.map((org) => (
                    <div key={org.id}>
                        <Link href={`/org/${org.id}/listings`}>{org.name}</Link>
                    </div>
                ))}
        </>
    );
};

export default Demo;
