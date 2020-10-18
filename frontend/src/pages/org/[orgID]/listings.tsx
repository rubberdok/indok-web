import OrganizationListings from "@components/pages/listings/organization/organizationListings";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { ORGANIZATION } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";
import CreateListing from "@components/pages/listings/organization/createListing";

const OrganizationListingsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ orgID }) => {
    const { loading, error, data } = useQuery<{ organization: Organization }>(ORGANIZATION, {
        variables: {
            ID: Number(orgID),
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <>
            {data && (
                <>
                    <div>
                        <h3>{data.organization.name}</h3>
                    </div>
                    <div>{data.organization.description}</div>
                    <div>
                        <h4>Opprett verv:</h4>
                    </div>
                    <CreateListing />
                    <div>
                        <h4>Åpne verv:</h4>
                    </div>
                    <OrganizationListings organization={data.organization} />
                </>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps<{ orgID: string }> = async (context) => {
    console.log(context.query);
    const orgID = context.query.orgID as string;
    return {
        props: { orgID },
    };
};

export default OrganizationListingsPage;
