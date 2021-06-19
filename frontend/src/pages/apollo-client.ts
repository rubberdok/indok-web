import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";


const link = createHttpLink({
  uri: typeof window === 'undefined' 
    ? process.env.NEXT_CONTAINER_GRAPHQL_BACKEND_URI
    : process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;