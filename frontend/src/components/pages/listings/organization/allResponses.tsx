import { Listing, Response } from "@interfaces/listings";
import { useQuery, useMutation } from "@apollo/client";
import { RESPONSES } from "@graphql/listings/queries";
import { DELETE_RESPONSE } from "@graphql/listings/mutations";

const AllResponses: React.FC<{ listing: Listing }> = ({ listing }) => {
    const { loading, error, data } = useQuery<{ listing: { responses: Response[] } }>(RESPONSES, {
        variables: { ID: Number(listing.id) },
    });
    const [deleteResponse] = useMutation<{ deleteResponse: { ok: boolean; response: Response } }>(DELETE_RESPONSE);
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data &&
                data.listing.responses.map((response) => (
                    <li key={response.id}>
                        Response #{response.id}
                        <br />
                        {response.response}
                        <br />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                deleteResponse({
                                    variables: {
                                        ID: response.id,
                                    },
                                });
                            }}
                        >
                            Slett
                        </button>
                    </li>
                ))}
        </ul>
    );
};

export default AllResponses;
