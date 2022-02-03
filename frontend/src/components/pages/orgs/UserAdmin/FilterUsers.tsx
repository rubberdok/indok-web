import React, { useEffect, useState } from "react";
import FilterButtons from "@components/pages/archive/FilterButtons";
import SearchBar from "@components/pages/archive/SearchBar";
import { useRouter } from "next/router";
import { Grid } from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";
import { RemoveFiltersButton } from "@components/pages/archive/RemoveFiltersButton";

type Props = {
  handleGroupFilter: (name: string, active: boolean) => void;
  handleSearch: (text: string) => void;
  setResetCheckedPeople: (reset: boolean) => void,
};

//TODO: filter when clicking on a group or writing in searchbar
const FilterUsers: React.FC<Props> = ({ handleSearch, handleGroupFilter, setResetCheckedPeople }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);
  const [searchFilter, setSearchFilter] = useState("");
  const [viewFeatured, setViewFeatured] = useState(true);
  const [typeFilters, setTypeFilters] = useState<{ [Key: string]: { active: boolean; title: string } }>({});

  //Removing all filters, including checkmarks 
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
      setResetCheckedPeople(true);;
      return newTypeFilters;
    });
    setViewFeatured(true);
  }

  //Fetching permissionsgroups 
  const { error, loading, data } = useQuery<{
    organization: { permissionGroups: { name: string; uuid: string }[] };
  }>(
    gql`
      query organization($id: ID) {
        organization(id: $id) {
          permissionGroups {
            name
            uuid
          }
        }
      }
    `,
    { variables: { id: orgNumberId } }
  );

  //When writing in the searchbar it sends to the parent element
  useEffect(() => {
    handleSearch(searchFilter);
  }, [searchFilter])

  // Fetching and updating typeFilters dynamically, depending on permissiongroups
  useEffect(() => {
    const buttons: { [key: string]: { active: boolean; title: string } } = {};
    data?.organization.permissionGroups.forEach((group) => {
      buttons[group.uuid] = {
        title: group.name,
        active: false,
      };
    });
    setTypeFilters(buttons);
  }, [data?.organization]);

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

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
