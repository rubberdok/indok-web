import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Filter } from "react-feather";
import styled from "styled-components";
import { FilterQuery } from ".";
import { useAllEventCategoriesQuery, useEventFilteredOrganizationsQuery } from "src/api/generated/graphql";

interface Props {
  filters: FilterQuery;
  onChange: (query: FilterQuery) => void;
}

const FilterMenu: React.FC<Props> = ({ filters, onChange }) => {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [openOrganizationDropDown, setOpenOrganizationDropDown] = useState(false);
  const [openCategoryDropDown, setOpenCategoryDropDown] = useState(false);

  useEffect(() => {
    setCurrentFilters(filters);
  }, [filters]);

  const OrganizationFilter = () => {
    const { loading, error, data } = useEventFilteredOrganizationsQuery();

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
      <div style={{ paddingTop: "0.5em" }}>
        <InvisibleButton
          onClick={() => setOpenOrganizationDropDown(!openOrganizationDropDown)}
          active={openOrganizationDropDown}
        >
          Organisasjoner
          {openOrganizationDropDown ? (
            <ChevronDown style={{ float: "left", width: "18px", paddingBottom: "2%" }} />
          ) : (
            <ChevronRight style={{ float: "left", width: "18px", paddingBottom: "2%" }} />
          )}
        </InvisibleButton>

        <FadeInAndOutDiv className={openOrganizationDropDown ? "active" : ""}>
          {data?.eventFilteredOrganizations?.map(
            (org) =>
              org && (
                <div key={org.name}>
                  <InvisibleButton
                    style={{ marginBottom: "0.4em", fontSize: "16px" }}
                    onClick={() => setCurrentFilters({ ...currentFilters, organization: org.name })}
                    active={currentFilters?.organization === org.name}
                  >
                    {org.name}
                  </InvisibleButton>

                  {org.children?.map((subOrg) => (
                    <InvisibleButton
                      key={subOrg.name}
                      style={{ marginBottom: "0.3em", marginLeft: "1em", fontSize: "14px" }}
                      active={currentFilters?.organization === subOrg.name || currentFilters?.organization === org.name}
                      onClick={() => setCurrentFilters({ ...currentFilters, organization: subOrg.name })}
                    >
                      {subOrg.name}
                    </InvisibleButton>
                  ))}
                </div>
              )
          )}
        </FadeInAndOutDiv>
      </div>
    );
  };

  const CategoryFilter = () => {
    const { loading, error, data } = useAllEventCategoriesQuery();

    // should handle loading status
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
      <div style={{ paddingTop: "0.5em" }}>
        <InvisibleButton onClick={() => setOpenCategoryDropDown(!openCategoryDropDown)} active={openCategoryDropDown}>
          Kategorier
          {openCategoryDropDown ? (
            <ChevronDown style={{ float: "left", width: "18px", paddingBottom: "2%" }} />
          ) : (
            <ChevronRight style={{ float: "left", width: "18px", paddingBottom: "2%" }} />
          )}
        </InvisibleButton>

        <FadeInAndOutDiv className={openCategoryDropDown ? "active" : ""}>
          {data?.allCategories?.map(
            (category) =>
              category && (
                <InvisibleButton
                  key={category.name}
                  style={{ marginBottom: "0.4em", fontSize: "16px" }}
                  active={currentFilters?.category === category.name}
                  onClick={() => setCurrentFilters({ ...currentFilters, category: category.name })}
                >
                  {category.name}
                </InvisibleButton>
              )
          )}
        </FadeInAndOutDiv>
      </div>
    );
  };

  const DateTimeFilter = () => {
    return (
      <div style={{ paddingTop: "0.5em" }}>
        <Typography style={{ color: "#222", margin: 0, fontSize: "16px" }}>Tidspunkt</Typography>

        <div>
          <Typography style={{ marginBottom: "0px", marginTop: "0.05em", fontSize: "14px" }}>Fra:</Typography>
          <input
            type="datetime-local"
            placeholder="Start time"
            value={currentFilters?.startTime}
            onChange={(e) => setCurrentFilters({ ...currentFilters, startTime: e.currentTarget.value })}
          />
        </div>

        <div>
          <Typography style={{ marginBottom: "0px", marginTop: "0.05em", fontSize: "14px" }}>Til:</Typography>
          <input
            type="datetime-local"
            placeholder="Start time"
            value={currentFilters?.endTime}
            onChange={(e) => setCurrentFilters({ ...currentFilters, endTime: e.currentTarget.value })}
          />
        </div>
      </div>
    );
  };

  return (
    <FilterContainer>
      <div style={{ paddingLeft: "1em" }}>
        <div style={{ width: "100%" }}>
          <Filter style={{ marginTop: "0.1em", marginRight: "0.3em", float: "left", color: "#222" }} />
          <Typography>Filtre</Typography>
        </div>
        <div style={{ color: "#E3E3E3", backgroundColor: "#E3E3E3", marginRight: "10%", marginTop: "-7%" }}>
          <hr />
        </div>
        <div>
          <OrganizationFilter />
          <CategoryFilter />
          <DateTimeFilter />
        </div>
      </div>

      <div
        style={{
          marginTop: "1em",
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
          display: "flex",
        }}
      >
        <StyledCancelButton
          style={{ marginRight: "1em" }}
          onClick={() => {
            onChange({});
            setCurrentFilters({});
          }}
        >
          Nullstill
        </StyledCancelButton>
        <StyledFilterButton onClick={() => onChange(currentFilters)}>Filtrer</StyledFilterButton>
      </div>
    </FilterContainer>
  );
};

export default FilterMenu;

const FilterContainer = styled.div`
  width: 25%;
  border: solid;
  border-width: 1px 2px 2px 1px;
  border-color: #dcdcdc;
  border-radius: 0.2em;
  background-color: #fff;
  padding-bottom: 1em;
  min-width: 235px;
`;

const FadeInAndOutDiv = styled.div`
  padding-left: 1em;
  opacity: 0;
  width: 0;
  height: 0;
  transition: width 0.5s 0.2s, height 0.5s 0.2s, opacity 0.1s;
  overflow: hidden;
  width: 100%;

  &.active {
    opacity: 1;
    height: fit-content;
    transition: width 0.5s, height 1s, opacity 0.5s 0.1s;
    overflow: visible;
    width: 100%;
  }
`;

const InvisibleButton = styled.button<{ active?: boolean }>`
  background: transparent;
  color: #222;
  font-family: "Montserrat";
  font-size: 16px;
  border: none;
  display: flex;
  text-decoration: none !important;
  padding: 0;
  border-bottom: 1px solid transparent;
  transition: border 500ms ease;
  font-weight: ${(props) => (props.active ? "600" : "400")}; 

  &:hover {
    cursor: pointer;
    border-bottom: 1px solid #222;
  }

  &:focus {
    border: none;
    outline: none;
  }

  }
`;

const StyledFilterButton = styled.button`
  background: #000;
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
    background: #333;
    cursor: pointer;
  }

  &:focus {
    border: none;
    outline: none;
  }
`;

const StyledCancelButton = styled.button`
  background: #000;
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
    background: #333;
    cursor: pointer;
  }

  &:focus {
    border: none;
    outline: none;
  }
`;
