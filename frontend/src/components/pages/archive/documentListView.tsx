import { Title } from "@components/ui/Typography";
import React, { useState } from "react";

import FilterButton from "./FilterButtons";
import ListDocuments from "./listDocuments";
import { ContentWrapper } from "./wrapper";

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
    <div>
      <div style={{ flex: "100%" }}>
        <Title style={{ textAlign: "center" }}> Arkiv</Title>
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
      <ListDocuments
        document_types={Object.entries(typeFilters)
          .filter((key, _) => key[1].active)
          .map(([_, val]) => val.title)}
      />
    </div>
  );
};

export default DocumentListView;
