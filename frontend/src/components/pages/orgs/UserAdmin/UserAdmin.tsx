import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { User } from "@interfaces/users";
import { Grid } from "@material-ui/core";

const EditUsersInOrganization: React.FC = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const { error, loading, data } = useQuery<{
    organization: { users: User[] };
  }>(
    gql`
      query organization($id: ID) {
        organization(id: $id) {
          users {
            username
          }
        }
      }
    `,
    { variables: { id: orgNumberId } }
  );

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <Grid container>
      {data &&
        data.organization.users?.map((user) => (
          <Grid item key={user.username}>
            {user.username}
          </Grid>
        ))}
    </Grid>
  );
};

export default EditUsersInOrganization;
