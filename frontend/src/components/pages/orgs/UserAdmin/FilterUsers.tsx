import React, { useEffect, useState } from "react";
import SearchBar from "@components/pages/archive/SearchBar";
import { Checkbox, FormControlLabel, Grid, Typography } from "@material-ui/core";
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from "@material-ui/icons";
import { RemoveFiltersButton } from "@components/pages/archive/RemoveFiltersButton";

type permissionGroupsWithCheck = {
  checked: boolean;
  name: string;
  uuid: string;
};

type Props = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setResetCheckedPeople: () => void;
  permissionGroups: permissionGroupsWithCheck[];
  setPermissionGroups: React.Dispatch<React.SetStateAction<permissionGroupsWithCheck[]>>;
};

//TODO: filter when clicking on a group or writing in searchbar
const FilterUsers: React.FC<Props> = ({ setSearch, permissionGroups, setPermissionGroups, setResetCheckedPeople }) => {
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
      <Grid>{!viewFeatured && <RemoveFiltersButton handleRemoveFilterChanged={handleRemoveFilterChanged} />}</Grid>
    </>
  );
};

export default FilterUsers;
