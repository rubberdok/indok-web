"use client";

import { graphql } from "@/gql";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { notFound } from "next/navigation";

const profileDocument = graphql(/* GraphQL */ `
  query Profile {
    user {
      id
      feideEmail
      email
      username
      firstName
      lastName
      dateJoined
      graduationYear
      gradeYear
      allergies
      phoneNumber
      firstLogin
    }
  }
`);

export default function ProfilePage() {
  const { data } = useSuspenseQuery(profileDocument);

  if (data.user === null) notFound();

  return <>{data.user?.firstName}</>;
}
