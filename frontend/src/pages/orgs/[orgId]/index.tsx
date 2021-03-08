import Layout from "@components/Layout";
import { Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const OrganizationDetailPage: NextPage = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const numberId = typeof orgId === "string" && parseInt(orgId);

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Adminside for Organisasjon {numberId}</Typography>
        <Typography variant="body1">
          Dette er adminsiden til en gitt organisasjon. Her skal man kunne se en oversikt over for eksempel alle
          nåværende åpne arrangementer (tenk et kort per arrangement med oppsumert info som antall påmeldte). Andre ting
          som er nyttig her vil være liste over åpne vervstillinger, administrere medlemmer, kanskje
          organisasjonsspesifikk info elns.
        </Typography>
      </Container>
    </Layout>
  );
};

export default OrganizationDetailPage;
