import { Metadata } from "next";
import { redirect } from "next/navigation";

import { graphql } from "@/gql/app";
import { getClient } from "@/lib/apollo/ApolloClient";
import { config } from "@/utils/config";

export const metadata: Metadata = {
  title: {
    default: "Profil",
    template: "%s | Indøk NTNU",
  },
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
    loginUrl.searchParams.set("return-to", `${config.FRONTEND_URI}/profile`);
    return redirect(loginUrl.toString());
  }
  return <>{children}</>;
}
