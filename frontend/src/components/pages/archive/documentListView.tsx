import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import FilterButton from "./FilterButtons";
import ListDocuments from "./listDocuments";
import { ContentWrapper } from "./wrapper";
import YearSelector from "./yearSelector";
import ListFeaturedDocuments from "./listFeaturedDocuments";
import CustomizedSlider from "./slider";
import SearchDocuments from "./searchDocuments";
import EditIcon from "@material-ui/icons/Edit";
import { Heading, Paragraph, SubHeading } from "@components/ui/Typography";

const DocumentListView: React.FC = () => {
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
        <Typography variant="h1" style={{ textAlign: "center" }}>
          Arkiv
        </Typography>
      </div>
      <ContentWrapper
        style={{ marginLeft: "80px", marginRight: "80px", justifyContent: "space-evenly", paddingBottom: "50px" }}
      >
        <FilterButton
          typeFilters={typeFilters}
          updateTypeFilters={(key) =>
            setTypeFilters({
              ...typeFilters,
              [key]: { active: !typeFilters[key].active, title: typeFilters[key].title },
            })
          }
        />
      </ContentWrapper>
      <ContentWrapper
        style={{
          //justifyContent: "space-between",
          justifyContent: "center",
          marginLeft: "15%",
          marginRight: "15%",
          marginBottom: "32px",
          marginTop: "-16px",
        }}
      >
        <CustomizedSlider />
      </ContentWrapper>
      <ListFeaturedDocuments
        document_types={Object.entries(typeFilters)
          .filter((key, _) => key[1].active)
          .map(([_, val]) => val.title)}
      />
      <ListDocuments
        document_types={Object.entries(typeFilters)
          .filter((key, _) => key[1].active)
          .map(([_, val]) => val.title)}
      />
      {/*       <ContentWrapper style={{ marginTop: "32px", justifyContent: "center" }}>
        <button>Rediger arkiv <EditIcon style={{ fontSize: "large" }} /></button>
      </ContentWrapper> */}
    </>
  );
};

export default DocumentListView;
