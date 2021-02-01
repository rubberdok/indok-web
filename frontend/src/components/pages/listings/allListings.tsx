import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTINGS } from "@graphql/listings/queries";
import Link from "next/link";

//TODO: remove userID once user log-in is properly implemented
const AllListings: React.FC = () => {
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <ul>
          {data.listings.map((listing) => (
            <Link href={`/listings/${listing.id}/${listing.slug}`} passHref key={listing.id}>
              <a>
                <li>
                  <b>{listing.title}</b>
                  <br />
                  {listing.organization?.name}
                </li>
              </a>
            </Link>
          ))}
        </ul>
      )}
    </>
  );
};

export default AllListings;
