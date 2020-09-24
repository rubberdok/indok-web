import { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/Layout";
import { ALL_LISTINGS } from "../lib/allListings"
import { useQuery } from '@apollo/react-hooks';

const Listings:NextPage = () => {
    const {
        loading,
        error,
        data
    } = useQuery(ALL_LISTINGS);
    if(error){
        return(
            <h1>Error</h1>
        );
    }
    if(loading){
        return(
            <h1>Loading...</h1>
        );
    }
    return(
        <Layout>
            <ul>
                {data.listing.map(({ id, title }) => (
                    <li>
                        <Link href={`/listings/${id}`}><a>{title}</a></Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export default Listings;