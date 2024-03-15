"use client";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Container, Typography } from "@mui/material";
import { notFound, useRouter } from "next/navigation";

import { useAlerts } from "@/app/components/Alerts";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { graphql } from "@/gql/app";

import { UserForm } from "./_components/UserForm";

const ID_PREFIX = "editUser-";

const UserDocument = graphql(`
  query ProfileEditPage_User {
    user {
      user {
        id
        ...UserForm_User
      }
    }
  }
`);

export default function Page() {
  const { notify } = useAlerts();
  const router = useRouter();

  const { data } = useSuspenseQuery(UserDocument);

  const [updateUser] = useMutation(
    graphql(`
      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {
        updateUser(data: $data) {
          user {
            id
            ...UserForm_User
          }
        }
      }
    `),
    {
      onCompleted() {
        notify({
          message: "Endringene er lagret.",
          type: "success",
        });
        router.push("/profile");
      },
      onError(error) {
        notify({
          title: "Noe gikk galt",
          message: error.message,
          type: "error",
        });
      },
    }
  );

  if (!data.user.user) return notFound();

  return (
    <Container>
      <Breadcrumbs
        links={[
          { href: "/", name: "Hjem" },
          { href: "/profile", name: "Profil" },
          { href: "/profile/edit", name: "Rediger" },
        ]}
      />
      <Typography variant="subtitle1" component="h1">
        Oppdater personlig informasjon
      </Typography>
      <UserForm
        onSubmit={(values) => {
          updateUser({ variables: { data: values } });
        }}
        user={data.user.user}
        onCancel={() => router.push("/profile")}
        data-test-id={ID_PREFIX}
      />
    </Container>
  );
}
