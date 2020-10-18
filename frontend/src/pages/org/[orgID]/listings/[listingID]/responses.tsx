import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTING } from "@graphql/listings/queries";
import ListingResponses from "@components/pages/listings/organization/listingResponses";
import Link from "next/link";

const ListingResponsesPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
    listingID,
    orgID,
}) => {
    const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
        variables: {
            ID: listingID,
        },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading</p>;
    return (
        <>
            {data && (
                <>
                    <Link href={`/org/${orgID}/listings`}>Tilbake</Link>
                    <h3>{data.listing.title}</h3>
                    <p>{data.listing.description}</p>
                    <ListingResponses listing={data.listing} />
                </>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps<{
    listingID: string;
    orgID: string;
}> = async (context) => {
    const listingID = context.query.listingID as string;
    const orgID = context.query.orgID as string;
    return {
        props: { listingID, orgID },
    };
};

export default ListingResponsesPage;
