import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const ProfilePage: NextPage = () => {
  const { loading, error, data } = useQuery<{ user: User }>(GET_USER);
  const router = useRouter();
  if (loading) {
    return <h1>Loading ...</h1>;
  }
  if (!data || !data.user || error) {
    if (typeof window !== "undefined") {
      // redirect user to homepage if no user data and client side
      router.push("/");
      return null;
    }
  }
  const user = data?.user;

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Brukerprofil</Typography>
        {user ? (
          <div>
            <Typography variant="h3">{user.firstName}</Typography>
            <Typography variant="body1">
              <strong>Brukernavn:</strong> {user.username} <br />
              <strong>E-post:</strong> {user.email} <br />
              {/* <strong>Klassetrinn:</strong> {user.year} <br /> */}
            </Typography>
            <Typography variant="body2">
              Medlem siden {new Date(user.dateJoined).toLocaleString()} <br />
            </Typography>
          </div>
        ) : (
          <div> Du er ikke logget inn! Vennligst logg inn med Feide. </div>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
