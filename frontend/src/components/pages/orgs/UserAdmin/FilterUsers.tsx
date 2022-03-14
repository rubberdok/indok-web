import React, { useEffect, useState } from "react";
import SearchBar from "@components/pages/archive/SearchBar";
import { Checkbox, FormControlLabel, Grid, Typography, Button, Box } from "@material-ui/core";
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from "@material-ui/icons";
import RemoveFilterButton from "@components/pages/orgs/UserAdmin/RemoveFilterButton";
import { User } from "@interfaces/users";

type permissionGroupsWithCheck = {
  checked: boolean;
  name: string;
  uuid: string;
  users: {
    id: string;
  }[];
};

type UserWithCheck = User & { checked: boolean; ableToSeeSearchFilter: boolean; abletoSeeResponsibleGroup: boolean };

type Props = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  permissionGroups: permissionGroupsWithCheck[];
  setPermissionGroups: React.Dispatch<React.SetStateAction<permissionGroupsWithCheck[]>>;
  setResetCheckedPeople: () => void;
  checkedPeople: UserWithCheck[];
  hasNotMarkedPeople: boolean;
  setHasNotMarkedPeople: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterUsers: React.FC<Props> = ({
  setSearch,
  permissionGroups,
  setPermissionGroups,
  setResetCheckedPeople,
  checkedPeople,
  hasNotMarkedPeople,
  setHasNotMarkedPeople,
}) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [viewFeatured, setViewFeatured] = useState(true);

  //Gucci - Removing all filters, including checkmarks
  const handleRemoveFilterChanged = () => {
    setSearchFilter("");
    const newPermissionGroup: permissionGroupsWithCheck[] = [];
    permissionGroups.forEach((group) => {
      const newGroup = {
        ...group,
        checked: false,
      };
      newPermissionGroup.push(newGroup);
    });
    setPermissionGroups(newPermissionGroup);
    setViewFeatured(true);
  };

  //Gucci - removing
  const handleRemoveSelectedPeople = () => {
    setResetCheckedPeople();
    setHasNotMarkedPeople(true);
  };

  // Gucci - Handling group filter change
  const handleGroupFilterChange = (group: permissionGroupsWithCheck) => {
    setViewFeatured(false);
    const newGroups: permissionGroupsWithCheck[] = [];
    permissionGroups.forEach((oldGroup) => {
      if (oldGroup.uuid == group.uuid) {
        const newGroup = {
          ...oldGroup,
          checked: !oldGroup.checked,
        };
        newGroups.push(newGroup);
      } else {
        newGroups.push(oldGroup);
      }
    });
    setPermissionGroups(newGroups);
  };

  //Gucci - When writing in the searchbar it sends to the parent element
  useEffect(() => {
    setSearch(searchFilter);
  }, [searchFilter]);

  return (
    <>
      <Grid item xs={12} md={6}>
        {permissionGroups.map((group) => {
          return (
            <FormControlLabel
              label={<Typography variant="body2">{group.name}</Typography>}
              key={group.uuid}
              control={
                <Checkbox
                  color="primary"
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  checked={group.checked}
                  name={group.name}
                  onChange={() => handleGroupFilterChange(group)}
                />
              }
            />
          );
        })}
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
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <RemoveFilterButton
            isDisabled={viewFeatured}
            text={"Fjern filterering"}
            handleAction={handleRemoveFilterChanged}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item xs={5} md={2}>
          <Button variant="contained" disabled={hasNotMarkedPeople}>
            Send email
          </Button>
        </Grid>
        <Grid item xs={5} md={2}>
          <Button variant="contained" disabled={hasNotMarkedPeople}>
            Endre grupper
          </Button>
        </Grid>
        <Grid item xs={5} md={2}>
          <Button variant="contained" disabled={hasNotMarkedPeople}>
            Fjern brukere
          </Button>
        </Grid>
        <Grid item xs={5} md={2}>
          <Button variant="contained" disabled={hasNotMarkedPeople} onClick={handleRemoveSelectedPeople}>
            Fjern markeringer
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FilterUsers;
