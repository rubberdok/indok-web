import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { config } from "@/utils/config";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function Layout({ children }: React.PropsWithChildren) {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query ProfileLayout_UserQuery {
        user {
          user {
            id
          }
        }
      }
    `),
  });
  if (data.user.user === null) {
    const loginUrl = new URL("/auth/login", config.API_URL);
    loginUrl.searchParams.set("redirect", `${config.FRONTEND_URI}/profile`);
    return redirect(loginUrl.toString());
  }
  return <>{children}</>;
}
