"use client";

import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

import { graphql } from "@/gql";

const logoutDocument = graphql(/* GraphQL */ `
  mutation Logout {
    logout {
      idToken
    }
  }
`);

export function LogoutButton() {
  const router = useRouter();
  const [logout, { client }] = useMutation(logoutDocument, {
    async onCompleted() {
      client.onResetStore(() => new Promise(() => router.replace("/")));
      await client.resetStore();
    },
  });
  return (
    <Button onClick={() => logout()} color="error" variant="contained">
      Logg ut
    </Button>
  );
}
