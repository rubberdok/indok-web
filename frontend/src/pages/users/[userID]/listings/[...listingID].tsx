import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import TextField from "@components/pages/surveys/formComponents/textfield";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import Link from "next/link";
import CreateResponse from "@components/pages/listings/createResponse";
import NavBar from "@components/navbar/Navbar";

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ userID, listingID }) => {
    const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, {
        variables: { ID: Number(listingID[0]) },
    });
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
    return (
        <>
            {data && (
                <Layout>
                    <Link href={`/users/${userID}/listings`}>Tilbake</Link>
                    <h3>{data.listing.title}</h3>
                    <p>{data.listing.description}</p>
                    <p>Frist: {data.listing.deadline.slice(0, 16).replace("T", " ")}</p>
                    <CreateResponse listing={data.listing} applicantID={userID}>
                        <TextField title="Søk:" placeholder="Din søknad..." size="long" />
                    </CreateResponse>
                </Layout>
            )}
        </>
    );
};

export default ListingPage;

export const getServerSideProps: GetServerSideProps<{ userID: string; listingID: string }> = async (context) => {
    const listingID = context.query.listingID as string;
    const userID = context.query.userID as string;
    return {
        props: { userID, listingID },
    };
};

/*TODO: Implement getStaticPaths/getStaticProps
export const getStaticPaths: GetStaticPaths = async () => {
    const { error, data } = useQuery(ALL_LISTING_IDS);
    if (error) {
        console.log("Error fetching listing IDs");
    }
    const paths: string[] = data.allListings.map((listing: Listing) => ({
        params: { id: listing.id },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const listingData = useQuery(LISTING_BY_ID, { variables: { id: params?.id as string } });
    return {
        props: {
            listingData,
        },
    };
}; */
