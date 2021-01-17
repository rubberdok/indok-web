import { useMutation, gql } from "@apollo/client";
import { CREATE_ORGANIZATION } from "@graphql/listings/mutations";
import { Organization } from "@interfaces/listings";
import { useState } from "react";
import TextField from "@components/pages/surveys/formComponents/textfield";

const CreateOrganization: React.FC = () => {
  const [newOrganization, setNewOrganization] = useState<Organization>({} as Organization);
  const [createOrganization] = useMutation<{ createOrganization: { organization: Organization } }>(
    CREATE_ORGANIZATION,
    {
      update: (cache, { data }) => {
        data &&
          cache.modify({
            fields: {
              //TODO: change allOrganizations to organizations
              allOrganizations: (existingOrganizations) => {
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
        title="Navn på foreningen: "
        onChange={(e) => setNewOrganization({ ...newOrganization, name: e.target.value })}
        value={newOrganization.name}
      />
      <br />
      <TextField
        title="Beskrivelse: "
        size="short"
        onChange={(e) => setNewOrganization({ ...newOrganization, description: e.target.value })}
        value={newOrganization.description}
      />
      <br />
      <button type="submit">Opprett forening</button>
    </form>
  );
};

export default CreateOrganization;
