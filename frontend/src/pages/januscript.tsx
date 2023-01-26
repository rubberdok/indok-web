import { Container, Box } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

import { Documents } from "@/components/pages/januscript/Documents";
import { Title } from "@/components/Title";
import { HasPermissionDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";

import { NextPageWithLayout } from "./_app";

const Archive: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const typeFilters = { Januscript: { active: true, title: "Januscript" } };
  return (
    <>
      <Title
        title="Januscript"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Januscript", href: "/januscript" },
        ]}
      />

      <Container>
        {[2022, 2021].map((year) => {
          return (
            <Box key={year}>
              <Documents
                documentTypes={Object.entries(typeFilters)
                  .filter((key) => key[1].active)
                  .map(([, val]) => val.title)}
                year={year}
              />
            </Box>
          );
        })}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const { data, error } = await client.query({
    query: HasPermissionDocument,
    variables: {
      permission: "archive.view_archivedocument",
    },
  });

  if (error) return { notFound: true };
  if (!data.hasPermission) {
    return { notFound: true };
  }
  return addApolloState(client, { props: { data } });
};

Archive.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Archive;
