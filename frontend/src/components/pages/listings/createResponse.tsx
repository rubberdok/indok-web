import { Listing, Response } from "@interfaces/listings";
import { useMutation } from "@apollo/client";
import { CREATE_RESPONSE } from "@graphql/listings/mutations";
import React, { useState, ChangeEvent } from "react";

const CreateResponse: React.FC<{
    listing: Listing;
    children?: React.ReactNode;
}> = ({ listing, children }) => {
    const [response, setResponse] = useState<Response>({} as Response);
    const [createResponse] = useMutation<{ createResponse: { response: Response } }>(
        CREATE_RESPONSE /* , {
        //TODO: implement update for createResponse
        update: (cache, { data }) => {
            data && cache.modify({
                fields: {
                    listing: ({ existingResponses }: { existingResponses: Reference[] }) => {
                        const newResponse = cache.writeFragment<Response>({
                            data: data.createResponse.response,
                            fragment: gql`
                                fragment NewResponse on Response {
                                    id
                                }
                            `,
                        });
                        return { responses: [ ...existingResponses, newResponse ] }
                    },
                },
            });
        },
    } */
    );
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                createResponse({
                    variables: {
                        response: response.response,
                        applicantId: 1,
                        listingId: listing.id,
                    },
                });
                setResponse({ ...response, response: "" });
            }}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        value: response.response,
                        onChange: (e: ChangeEvent<HTMLInputElement>) =>
                            setResponse({ ...response, response: e.target.value }),
                    });
                }
                return child;
            })}
            <br />
            <button type="submit">Søk</button>
        </form>
    );
};

export default CreateResponse;
