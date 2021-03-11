import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const OrganizationPage: NextPage = () => {
  const { data } = useQuery<User>(GET_USER);
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Organisasjoner</Typography>
        <Typography variant="body1">
          På denne siden skal man kunne finne en oversikt over organisasjonene man er medlem av på nettsiden, og kunne
          trykke seg frem til deres adminsider.
        </Typography>
      </Container>
    </Layout>
  );
};

export default OrganizationPage;
