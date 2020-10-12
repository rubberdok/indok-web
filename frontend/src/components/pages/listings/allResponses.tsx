import { Listing, Response } from "@interfaces/listings";
import { useQuery } from "@apollo/client";
import { RESPONSES } from "@graphql/listings/queries";

const AllResponses: React.FC<{ listing: Listing }> = ({ listing }) => {
    const { loading, error, data } = useQuery<{ listing: { responses: Response[] } }>(RESPONSES, {
        variables: { ID: Number(listing.id) },
    });
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data!.listing.responses.map((response) => (
                <li key={response.id}>
                    Response #{response.id}
                    <br />
                    {response.response}
                </li>
            ))}
        </ul>
    );
};

export default AllResponses;
