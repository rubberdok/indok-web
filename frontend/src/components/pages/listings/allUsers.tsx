import { useQuery } from "@apollo/client";
import { USERS } from "@graphql/listings/queries";
import { User } from "@interfaces/listings";
import Link from "next/link";

const AllUsers: React.FC = () => {
  const { loading, error, data } = useQuery<{ users: User[] }>(USERS);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              <Link href={`/users/${user.id}/listings`}>{user.username}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AllUsers;
