import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTINGS } from "@graphql/listings/queries";
import Link from "next/link";
import List from "@components/ui/list";
import ListItem from "@components/ui/listItem";

//TODO: remove userID once user log-in is properly implemented
const AllListings: React.FC = () => {
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <List>
          {data.listings.map((listing) => (
            <ListItem key={listing.id} mainText={listing.title} subText={listing.organization?.name || "na"} selected={false}/>
/*
            <Link href={`/users/${userID}/listings/${listing.id}/${listing.slug}`}>{listing.title}</Link>
            <p>
              {listing.organization && (
                <>
                  {listing.organization.name}
                  <br />
                </>
              )}
              Frist: {listing.deadline.slice(0, 16).replace("T", " ")}
            </p>
*/
          ))}
        </List>
      )}
    </>
  );
};

export default AllListings;
