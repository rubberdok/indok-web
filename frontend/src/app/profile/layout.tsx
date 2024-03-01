"use client";

import { graphql } from "@/gql/app";
import { config } from "@/utils/config";
import { useSuspenseQuery } from "@apollo/client";
import { redirect } from "next/navigation";

export default function Layout({ children }: React.PropsWithChildren) {
  const { data } = useSuspenseQuery(
    graphql(`
      query ProfileLayout_UserQuery {
        user {
          user {
            id
          }
        }
      }
    `)
  );
  if (data.user.user === null) {
    const loginUrl = new URL("/auth/login", config.API_URL);
    loginUrl.searchParams.set("redirect", `${config.FRONTEND_URI}/profile`);
    return redirect(loginUrl.toString());
  }
  return children;
}
