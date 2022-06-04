import Documents from "@components/pages/archive/Documents";
import FeaturedDocumentsList from "@components/pages/archive/FeaturedDocumentsList";
import FilterButtons from "@components/pages/archive/FilterButtons";
import { RemoveFiltersButton } from "@components/pages/archive/RemoveFiltersButton";
import SearchBar from "@components/pages/archive/SearchBar";
import YearSelector from "@components/pages/archive/YearSelector";
import Title from "@components/Title";
import { HasPermissionDocument } from "@generated/graphql";
import { addApolloState, initializeApollo } from "@lib/apolloClient";
import { Box, Container, FormGroup, Grid, styled } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";
import Layout from "src/layouts";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { NextPageWithLayout } from "./_app";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const Archive: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const [yearFilter, setYearFilter] = useState("");

  const [searchFilter, setSearchFilter] = useState("");

  const [viewFeatured, setViewFeatured] = useState(true);

  const [typeFilters, setTypeFilters] = useState<Record<string, { active: boolean; title: string }>>({
    Budget: { active: false, title: "Budsjett og Regnskap" },
    Summary: { active: false, title: "Generalforsamling" },
    Yearbook: { active: false, title: "Årbøker" },
    Guidelines: { active: false, title: "Støtte fra HS" },
    Regulation: { active: false, title: "Foreningens lover" },
    Statues: { active: false, title: "Utveksling" },
    Others: { active: false, title: "Annet" },
  });

  return (
    <RootStyle>
      <Title>Arkiv</Title>

      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormGroup row>
              <FilterButtons
                typeFilters={typeFilters}
                updateTypeFilters={(key) => {
                  setTypeFilters((prevState) => ({
                    ...prevState,
                    [key]: { active: !typeFilters[key].active, title: typeFilters[key].title },
                  }));
                  setViewFeatured(false);
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <SearchBar
              searchFilter={searchFilter}
              handleSearchFilterChanged={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchFilter(event.target.value);
                setViewFeatured(false);
              }}
              handleSearchFilterCanceled={() => setSearchFilter("")}
            />
          </Grid>
        </Grid>

        <Box mt={3} mb={6}>
          <YearSelector
            yearFilter={yearFilter}
            handleYearFilterChanged={(year: string) => {
              setYearFilter(year);
              setViewFeatured(false);
            }}
          />
        </Box>

        {!viewFeatured && (
          <RemoveFiltersButton
            handleRemoveFilterChanged={() => {
              setYearFilter("");
              setSearchFilter("");
              setTypeFilters({
                Budget: { active: false, title: "Budsjett og Regnskap" },
                Summary: { active: false, title: "Generalforsamling" },
                Yearbook: { active: false, title: "Årbøker" },
                Guidelines: { active: false, title: "Støtte fra HS" },
                Regulation: { active: false, title: "Foreningens lover" },
                Statues: { active: false, title: "Utveksling" },
                Others: { active: false, title: "Annet" },
              });
              setViewFeatured(true);
            }}
          />
        )}

        {viewFeatured && <FeaturedDocumentsList />}
        <Documents
          documentTypes={Object.entries(typeFilters)
            .filter((key) => key[1].active)
            .map(([, val]) => val.title)}
          year={parseInt(yearFilter)}
          names={searchFilter}
        />
      </Container>
    </RootStyle>
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
