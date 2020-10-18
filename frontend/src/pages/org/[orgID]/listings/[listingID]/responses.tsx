import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQuery } from "@apollo/client";
import { Listing, Response } from "@interfaces/listings";
import { RESPONSES } from "@graphql/listings/queries";

const ListingResponsesPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ listingID }) => {
    const { loading, error, data } = useQuery<{ listing: Listing }>(RESPONSES, {
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
                    <ul>
                        {data.listing.responses &&
                            data.listing.responses.map((response) => (
                                <li key={response.id}>
                                    <h4>Response #{response.id}</h4>
                                    <p>{response.response}</p>
                                </li>
                            ))}
                    </ul>
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
