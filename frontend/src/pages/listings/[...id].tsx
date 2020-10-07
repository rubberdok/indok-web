import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import TextField from "@components/pages/listings/textfield";
import { LISTING_BY_ID } from "@graphql/listings/queries";

const Listing: NextPage = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { loading, error, data } = useQuery(LISTING_BY_ID, { variables: { ID: Number(id[0]) } });
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;
    const listing = data.listingById;
    return (
        <Layout>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <TextField title="Apply:" placeholder="Your application" size="short" />
        </Layout>
    );
};

export default Listing;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
