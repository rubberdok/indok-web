import Layout from "@components/Layout";
import DocumentList from "@components/pages/archive/DocumentList";
import FeaturedDocumentsList from "@components/pages/archive/FeaturedDocumentsList";
import FilterButtons from "@components/pages/archive/FilterButtons";
import { RemoveFiltersButton } from "@components/pages/archive/RemoveFiltersButton";
import SearchBar from "@components/pages/archive/SearchBar";
import YearSelector from "@components/pages/archive/YearSelector";
import { Box, Container, FormGroup, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import { NextPage } from "next";
import React, { useState } from "react";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const Archive: NextPage = () => {
  if (redirectIfNotLoggedIn()) {
    return null;
  }
  const classes = useStyles();
  const theme = useTheme();

  const [yearFilter, setYearFilter] = useState("");

  const [searchFilter, setSearchFilter] = useState("");

  const [viewFeatured, setViewFeatured] = useState(true);

  const [typeFilters, setTypeFilters] = useState<{ [key: string]: { active: boolean; title: string } }>({
    Budget: { active: false, title: "Budsjett og Regnskap" },
    Summary: { active: false, title: "Generalforsamling" },
    Yearbook: { active: false, title: "Årbøker" },
    Guidelines: { active: false, title: "Støtte fra HS" },
    Regulation: { active: false, title: "Foreningens lover" },
    Statues: { active: false, title: "Utveksling" },
    Others: { active: false, title: "Annet" },
  });

  return (
    <Layout>
      <Box width="100%" pt={10} pb={7} mb={4} bgcolor={theme.palette.background.paper}>
        <Container>
          <Typography variant="h1" gutterBottom>
            Arkiv
          </Typography>
        </Container>
      </Box>

      <Container className={classes.container}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormGroup row>
              <FilterButtons
                typeFilters={typeFilters}
                updateTypeFilters={(key) => {
                  [
                    setTypeFilters({
                      ...typeFilters,
                      [key]: { active: !typeFilters[key].active, title: typeFilters[key].title },
                    }),
                    setViewFeatured(false),
                  ];
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <SearchBar
              searchFilter={searchFilter}
              handleSearchFilterChanged={(newValue: string) => {
                [setSearchFilter(newValue), setViewFeatured(false)];
              }}
              handleSearchFilterCanceled={() => setSearchFilter("")}
            />
          </Grid>
        </Grid>

        <Box mt={3} mb={6}>
          <YearSelector
            yearFilter={yearFilter}
            handleYearFilterChanged={(year: string) => {
              [setYearFilter(year), setViewFeatured(false)];
            }}
          />
        </Box>

        {!viewFeatured && (
          <RemoveFiltersButton
            handleRemoveFilterChanged={() => {
              [
                setYearFilter(""),
                setSearchFilter(""),
                setTypeFilters({
                  Budget: { active: false, title: "Budsjett og Regnskap" },
                  Summary: { active: false, title: "Generalforsamling" },
                  Yearbook: { active: false, title: "Årbøker" },
                  Guidelines: { active: false, title: "Støtte fra HS" },
                  Regulation: { active: false, title: "Foreningens lover" },
                  Statues: { active: false, title: "Utveksling" },
                  Others: { active: false, title: "Annet" },
                }),
                setViewFeatured(true),
              ];
            }}
          />
        )}

        {viewFeatured && <FeaturedDocumentsList />}
        <DocumentList
          document_types={Object.entries(typeFilters)
            .filter((key, _) => key[1].active)
            .map(([_, val]) => val.title)}
          year={parseInt(yearFilter)}
          names={searchFilter}
        />
      </Container>
    </Layout>
  );
};

export default Archive;
