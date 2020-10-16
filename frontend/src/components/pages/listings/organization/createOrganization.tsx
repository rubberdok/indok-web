import { useMutation, gql } from "@apollo/client";
import { CREATE_ORGANIZATION } from "@graphql/listings/mutations";
import { Organization } from "@interfaces/listings";
import { useState } from "react";
import TextField from "@components/pages/listings/formComponents/textfield";

const CreateOrganization: React.FC = () => {
    const [newOrganization, setNewOrganization] = useState<Organization>({} as Organization);
    const [createOrganization] = useMutation<{ createOrganization: { organization: Organization } }>(
        CREATE_ORGANIZATION,
        {
            update: (cache, { data }) => {
                data &&
                    cache.modify({
                        fields: {
                            organizations: (existingOrganizations) => {
                                const newOrganization = cache.writeFragment<Organization>({
                                    data: data.createOrganization.organization,
                                    fragment: gql`
                                        fragment NewOrganization on Organization {
                                            id
                                        }
                                    `,
                                });
                                return [...existingOrganizations, newOrganization];
                            },
                        },
                    });
            },
        }
    );
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                createOrganization({
                    variables: {
                        name: newOrganization.name,
                        description: newOrganization.description,
                    },
                });
                setNewOrganization({ ...newOrganization, name: "", description: "" });
            }}
        >
            <TextField
                title="Navn på organisasjonen: "
                onChange={(e) => setNewOrganization({ ...newOrganization, name: e.target.value })}
                value={newOrganization.name}
            />
            <TextField
                title="Beskrivelse: "
                onChange={(e) => setNewOrganization({ ...newOrganization, description: e.target.value })}
                value={newOrganization.description}
            />
            <button type="submit">Opprett organisasjon</button>
        </form>
    );
};

export default CreateOrganization;
