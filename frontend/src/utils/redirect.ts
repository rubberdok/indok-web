import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { useRouter } from "next/router";

export const redirectIfNotLoggedIn = (to?: string): boolean => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);
  const router = useRouter();

  if (loading) {
    return false;
  }

  if (!data || !data.user || error) {
    if (typeof window !== "undefined") {
      // redirect user if no user data and client side
      router.push(to || "/");
      return true;
    }
  }
  return false;
};
