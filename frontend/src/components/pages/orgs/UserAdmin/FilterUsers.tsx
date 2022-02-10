import React, { useEffect, useState } from "react";
import FilterButtons from "@components/pages/archive/FilterButtons";
import SearchBar from "@components/pages/archive/SearchBar";
import { useRouter } from "next/router";
import { Grid } from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";
import { RemoveFiltersButton } from "@components/pages/archive/RemoveFiltersButton";

type GroupFilter = { name: string, checked: boolean }

type permissionGroupsWithCheck = {
  checked: boolean,
  name: string,
  uuid: string,
}

type Props = {

  handleGroupFilter: (groupFilter: GroupFilter) => void;
  handleSearch: (text: string) => void;
  setResetCheckedPeople: () => void,
  permissionGroups: permissionGroupsWithCheck[],
};

//TODO: filter when clicking on a group or writing in searchbar
const FilterUsers: React.FC<Props> = ({ handleSearch, permissionGroups, handleGroupFilter, setResetCheckedPeople }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);
  const [searchFilter, setSearchFilter] = useState("");
  const [viewFeatured, setViewFeatured] = useState(true);
  const [typeFilters, setTypeFilters] = useState<{ [Key: string]: { active: boolean; title: string } }>({});

  //Gucci - Removing all filters, including checkmarks 
  const handleRemoveFilterChanged = () => {
    setSearchFilter("");
    setTypeFilters((typeFilters) => {
      const newTypeFilters = typeFilters;
      for (const key of Object.keys(newTypeFilters)) {
        newTypeFilters[key] = {
          ...typeFilters[key],
          active: false,
        };
      }
      setResetCheckedPeople();;
      return newTypeFilters;
    });
    setViewFeatured(true);
  }

  //Gucci - When writing in the searchbar it sends to the parent element
  useEffect(() => {
    handleSearch(searchFilter);
  }, [searchFilter])

  // Gucci - Displaying buttons to checkmark
  useEffect(() => {
    const buttons: { [key: string]: { active: boolean; title: string } } = {};
    permissionGroups.forEach((group) => {
      buttons[group.uuid] = {
        title: group.name,
        active: group.checked,
      }
    });
    setTypeFilters(buttons);
  }, [permissionGroups]);

  return (
    <>
      <Grid item xs={12} md={6}>
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
      </Grid>
      <Grid item xs={8} md={6}>
        <SearchBar
          searchFilter={searchFilter}
          handleSearchFilterChanged={(newValue: string) => {
            [setSearchFilter(newValue), setViewFeatured(false)];
          }}
          handleSearchFilterCanceled={() => setSearchFilter("")}
          placeholder="Søk på medlemmer"
        />
      </Grid>
      <Grid>
        {!viewFeatured && (
          <RemoveFiltersButton
            handleRemoveFilterChanged={handleRemoveFilterChanged}
          />
        )}
      </Grid>
    </>
  );
};

export default FilterUsers;
