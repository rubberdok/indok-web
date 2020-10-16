import OrganizationListings from "@components/pages/listings/organization/organizationListings";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { ORGANIZATION } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";

const OrganizationListingsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ orgID }) => {
    const { loading, error, data } = useQuery<{ organization: Organization }>(ORGANIZATION, {
        variables: {
            ID: Number(orgID),
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return <>{data && <OrganizationListings organization={data.organization} />}</>;
};

export const getServerSideProps: GetServerSideProps<{ orgID: string }> = async (context) => {
    console.log(context);
    const orgID = context.query.orgID as string;
    return {
        props: { orgID },
    };
};

export default OrganizationListingsPage;
