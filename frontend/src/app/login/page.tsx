import { RedirectType, permanentRedirect, redirect } from "next/navigation";

import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { config } from "@/utils/config";

export default async function Page() {
  const client = getClient();
  const { data } = await client.query({
    query: graphql(`
      query LoginPage_UserQuery {
        user {
          user {
            id
          }
        }
      }
    `),
  });
  if (data.user.user) return redirect("/", RedirectType.replace);

  const loginUrl = new URL("/auth/login", config.API_URL);
  loginUrl.searchParams.append("redirect", new URL("/profile", config.FRONTEND_URI).toString());
  return permanentRedirect(loginUrl.toString(), RedirectType.replace);
}
