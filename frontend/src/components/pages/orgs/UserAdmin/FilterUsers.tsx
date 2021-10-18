import { Organization } from "@interfaces/organizations";
import React, { useEffect, useState } from "react";
import FilterButtons from "@components/pages/archive/FilterButtons";
import SearchBar from "@components/pages/archive/SearchBar";
import { useRouter } from "next/router";
import { Grid } from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";

type Props = {
  organization: Organization;
};

//TODO: filter when clicking on a group or writing in searchbar
const FilterUsers: React.FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const [searchFilter, setSearchFilter] = useState("");

  const [viewFeatured, setViewFeatured] = useState(true);

  const [typeFilters, setTypeFilters] = useState<{ [Key: string]: { active: boolean; title: string } }>({});

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

  // Fetching correct buttons dynamically
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
  //      <p>{data?.organization.permissionGroups[1].name}</p>
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
    </>
  );
};

export default FilterUsers;
