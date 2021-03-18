import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import FilterButton from "./FilterButtons";
import ListDocuments from "./listDocuments";
import { ContentWrapper } from "./wrapper";
import YearSelector from "./yearSelector";
import ListFeaturedDocuments from "./listFeaturedDocuments";
import SearchBarComp from "./searchBar";
import { RemoveFilters } from "./removeFilters";

const DocumentListView: React.FC = () => {
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
    <>
      <div style={{ flex: "100%" }}>
        <Typography variant="h1" style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
          Arkiv
        </Typography>
      </div>
      <ContentWrapper style={{ justifyContent: "space-evenly", paddingBottom: "8px" }}>
        <FilterButton
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
        <ContentWrapper style={{ flex: 1 }}>
          <YearSelector
            yearFilter={yearFilter}
            handleYearFilterChanged={(year: string) => {
              [setYearFilter(year), setViewFeatured(false)];
            }}
          />
        </ContentWrapper>
      </ContentWrapper>
      <ContentWrapper style={{ justifyContent: "flex-end", marginTop: "16px", marginBottom: "5%" }}>
        <SearchBarComp
          searchFilter={searchFilter}
          handleSearchFilterChanged={(newValue: string) => {
            [setSearchFilter(newValue), setViewFeatured(false)];
          }}
          handleSearchFilterCanceled={() => setSearchFilter("")}
        />
      </ContentWrapper>
      {!viewFeatured && (
        <ContentWrapper style={{ paddingLeft: "78.7%", marginTop: "-9%", marginBottom: "5%" }}>
          <RemoveFilters
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
        </ContentWrapper>
      )}

      {viewFeatured && (
        <ContentWrapper style={{ marginBottom: "16px" }}>
          <ListFeaturedDocuments />
        </ContentWrapper>
      )}
      <ContentWrapper style={{ marginTop: "16px" }}>
        <ListDocuments
          document_types={Object.entries(typeFilters)
            .filter((key, _) => key[1].active)
            .map(([_, val]) => val.title)}
          year={parseInt(yearFilter)}
          names={searchFilter}
        />
      </ContentWrapper>
    </>
  );
};

export default DocumentListView;
