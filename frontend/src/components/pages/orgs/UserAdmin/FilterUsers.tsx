import { Organization } from "@interfaces/organizations";
import React, { useEffect, useState } from "react";
import FilterButtons from "@components/pages/archive/FilterButtons";
import SearchBar from "material-ui-search-bar";
import { useRouter } from "next/router";
import { Grid } from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";
import { User } from "@interfaces/users";

type Props = {
  organization: Organization;
};

const FilterUsers: React.FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const orgNumberId = parseInt(orgId as string);

  const { error, loading, data } = useQuery<{
    organization: { permissionGroups: { permissionGroups: { name: string; uuid: string } } };
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

  //TODO: make dynamic
  const [typeFilters, setTypeFilters] = useState<{ [key: string]: { active: boolean; title: string } }>({
    Budget: { active: false, title: "Budsjett og Regnskap" },
    Summary: { active: false, title: "Generalforsamling" },
    Yearbook: { active: false, title: "Årbøker" },
    Guidelines: { active: false, title: "Støtte fra HS" },
    Regulation: { active: false, title: "Foreningens lover" },
    Statues: { active: false, title: "Utveksling" },
    Others: { active: false, title: "Annet" },
  });

  const [viewFeatured, setViewFeatured] = useState(true);

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
        <SearchBar></SearchBar>
      </Grid>
    </>
  );
};

export default FilterUsers;
