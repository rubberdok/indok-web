import { useQuery } from "@apollo/client";
import { Filter } from "react-feather";
import { QUERY_EVENT_FILTERED_ORGANIZATIONS } from "@graphql/events/queries";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paragraph } from "@components/ui/Typography";
import styled from "styled-components";
import colors from "src/styles/theme";
import OrganizationFilter from "./OrganizationFilter";
import { FilterQuery } from "..";
import CategoryFilter from "./CategoryFilter";
import DateTimeFilter from "./DateTimeFilter";

interface Props {
  filters: FilterQuery;
  onChange: (query: FilterQuery) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(0),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  doubleNested: {
    paddingLeft: theme.spacing(2),
  },
}));

const FilterMenu: React.FC<Props> = ({ filters, onChange }) => {
  const classes = useStyles();
  const [currentFilters, setCurrentFilters] = useState(filters);

  const { loading: organizationLoading, error: organizationError, data: organizationData } = useQuery(
    QUERY_EVENT_FILTERED_ORGANIZATIONS
  );
  if (organizationLoading) return <p>Loading...</p>;
  if (organizationError) return <p>Error :(</p>;

  console.log(currentFilters);

  return (
    <FilterContainer>
      <div style={{ paddingLeft: "1em" }}>
        <div style={{ width: "100%" }}>
          <Filter style={{ marginTop: "0.1em", marginRight: "0.3em", float: "left", color: "#222" }} />
          <Paragraph>Filtre</Paragraph>
        </div>
        <div style={{ color: "#E3E3E3", backgroundColor: "#E3E3E3", marginRight: "10%", marginTop: "-7%" }}>
          <hr />
        </div>
      </div>
      <div>
        <OrganizationFilter
          filters={currentFilters}
          onFiltersChange={setCurrentFilters}
          organizations={organizationData.eventFilteredOrganizations}
          name={"Organisasjoner"}
          classes={classes}
        />

        <CategoryFilter filters={currentFilters} onFiltersChange={setCurrentFilters} classes={classes} />

        <DateTimeFilter filters={currentFilters} onFiltersChange={setCurrentFilters} />
      </div>

      <div
        style={{
          marginTop: "1em",
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
        }}
      >
        <StyledCancelButton
          style={{ float: "left", marginRight: "1em" }}
          onClick={() => {
            onChange({});
            setCurrentFilters({});
          }}
        >
          Nullstill
        </StyledCancelButton>
        <StyledFilterButton style={{ float: "left" }} onClick={() => onChange(currentFilters)}>
          Filtrer
        </StyledFilterButton>
      </div>
    </FilterContainer>
  );
};

export default FilterMenu;

const FilterContainer = styled.div`
  float: left;
  width: 25%;
  border: solid;
  border-width: 1px 2px 2px 1px;
  border-color: #dcdcdc;
  border-radius: 0.2em;
  background-color: #fff;
  padding-bottom: 1em;
  min-width: 235px;
`;

const StyledFilterButton = styled.button`
  background: ${colors.colors.primary};
  color: #fff;
  font-family: "Montserrat";
  font-size: 16px;
  border: none;
  display: flex;
  align-items: stretch;
  text-decoration: none !important;
  transition: 0.3s all ease;
  padding: 0.4em;
  min-width: 80px;
  padding-left: 9%;

  &:hover {
    background: ${colors.colors.primaryDark};
    cursor: pointer;
  }

  &:focus {
    border: none;
    outline: none;
  }
`;

const StyledCancelButton = styled.button`
  background: ${colors.colors.secondary};
  color: #fff;
  font-family: "Montserrat";
  font-size: 16px;
  border: none;
  display: flex;
  align-items: stretch;
  text-decoration: none !important;
  transition: 0.3s all ease;
  padding: 0.4em;
  min-width: 80px;
  padding-left: 5%;

  &:hover {
    background: ${colors.colors.secondaryDark};
    cursor: pointer;
  }

  &:focus {
    border: none;
    outline: none;
  }
`;
