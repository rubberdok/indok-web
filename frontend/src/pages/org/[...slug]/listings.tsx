import OrganizationListings from "@components/pages/listings/organization/organizationListings";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { ORGANIZATION } from "@graphql/listings/queries";
import { Organization } from "@interfaces/listings";

const OrganizationListingsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
    const { loading, error, data } = useQuery<{ organization: Organization }>(ORGANIZATION, {
        variables: {
            ID: Number(id),
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <OrganizationListings organization={data!.organization} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
    const id = context.query.id as string;
    return {
        props: { id },
    };
};

export default OrganizationListingsPage;
