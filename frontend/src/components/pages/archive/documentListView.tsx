import { Title } from "@components/ui/Typography";
import React, { useState } from "react";

import FilterButton from "./FilterButtons";
import ListDocuments from "./listDocuments";
import { ContentWrapper } from "./wrapper";

const ColoredLine = ({ color }: any) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 5,
      marginTop: 20,
    }}
  />
);

const DocumentListView: React.FC = () => {
  const [typeFilters, setTypeFilters] = useState<{ [key: string]: { active: boolean; title: string } }>({
    BudReg: { active: false, title: "Budsjetter og regnskap" },
    GenFors: { active: false, title: "Generalforsamling" },
    Aarbok: { active: false, title: "Årbøker" },
    HS: { active: false, title: "Støtte fra HS" },
    Lover: { active: false, title: "Foreningens lover" },
    Utveksling: { active: false, title: "Utveksling" },
    Annet: { active: false, title: "Annet" },
  });

  return (
    <div>
      {/*   <ColoredLine color={1} /> */}
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
          .map(([key, _]) => key)}
      />
    </div>
  );
};

export default DocumentListView;
