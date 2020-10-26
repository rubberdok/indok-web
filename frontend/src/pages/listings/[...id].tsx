import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import TextField from "@components/pages/surveys/textfield";
import { LISTING } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import Link from "next/link";
import ResponseForm from "@components/pages/listings/responseForm";

const ListingPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
    const { loading, error, data } = useQuery<{ listing: Listing }>(LISTING, { variables: { ID: Number(id[0]) } });
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
    const listing = data!.listing;
    return (
        <Layout>
            <Link href="/listings">Tilbake</Link>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Frist: {listing.deadline.slice(0, 16).replace("T", " ")}</p>
            <ResponseForm>
                <TextField title="Søk:" placeholder="Din søknad..." size="long" />
            </ResponseForm>
        </Layout>
    );
};

export default ListingPage;

export const getServerSideProps: GetServerSideProps<{ id: string[] }> = async (context) => {
    const id = context.query.id as string[];
    return {
        props: { id },
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
