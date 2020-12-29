import { useMutation, gql } from "@apollo/client";
import { CREATE_USER } from "@graphql/listings/mutations";
import { User } from "@interfaces/listings";
import { useState } from "react";
import TextField from "@components/pages/surveys/formComponents/textfield";

const CreateUser: React.FC = () => {
    const [newUser, setNewUser] = useState<User>({} as User);
    const [createUser] = useMutation<{ createUser: { user: User } }>(
        CREATE_USER /* ,
        {
            update: (cache, { data }) => {
                data &&
                    cache.modify({
                        fields: {
                            users: (existingUsers) => {
                                const newUser = cache.writeFragment<User>({
                                    data: data.createUser.user,
                                    fragment: gql`
                                        fragment NewUser on User {
                                            id
                                        }
                                    `,
                                });
                                return [...existingUsers, newUser];
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
                createUser({
                    variables: {
                        username: newUser.username,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        year: newUser.year,
                        password: "test",
                    },
                });
                setNewUser({ ...newUser, username: "", firstName: "", lastName: "", year: "" });
            }}
        >
            <TextField
                title="Brukernavn: "
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                value={newUser.username}
            />
            <br />
            <TextField
                title="Fornavn: "
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                value={newUser.firstName}
            />
            <br />
            <TextField
                title="Etternavn: "
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                value={newUser.lastName}
            />
            <br />
            <TextField
                title="Kull: "
                onChange={(e) => setNewUser({ ...newUser, year: e.target.value })}
                value={newUser.year}
            />
            <br />
            <button type="submit">Opprett bruker</button>
        </form>
    );
};

export default CreateUser;
