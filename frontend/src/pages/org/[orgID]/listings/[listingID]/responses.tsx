import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { Listing, Response } from "@interfaces/listings";
import { LISTING } from "@graphql/listings/queries";
import AllResponses from "@components/pages/listings/organization/allResponses";

const ListingResponsesPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
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
                    <h3>{data.listing.title}</h3>
                    <p>{data.listing.description}</p>
                    <AllResponses listing={data.listing} />
                </>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps<{
    listingID: string;
}> = async (context) => {
    const listingID = context.query.listingID as string;
    return {
        props: { listingID },
    };
};

export default ListingResponsesPage;
