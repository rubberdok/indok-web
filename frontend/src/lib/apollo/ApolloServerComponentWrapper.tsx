import { cookies } from "next/headers";

import { ApolloWrapper } from "./ApolloWrapper";

/**
 * Cookies are not automatically passed to the ApolloWrapper, and are only accessible through server components.
 * Since we need the cookies on the server for SSR to work, we wrap our client component `ApolloWrapper` in this
 * server component, and use the `cookies` from the `next/headers` module to pass the cookies to the `ApolloWrapper`.
 */
export async function ApolloServerComponentWrapper(props: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return <ApolloWrapper cookies={cookieHeader}>{props.children}</ApolloWrapper>;
}
