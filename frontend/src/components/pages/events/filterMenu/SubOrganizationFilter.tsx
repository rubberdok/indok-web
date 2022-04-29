import { FilterQuery } from "@components/pages/events/AllEvents";
import { Organization } from "@interfaces/organizations";
import { Collapse, List, ListItem, ListItemText } from "@mui/material";
import { CaretDown, CaretUp } from "phosphor-react";
import React, { useState } from "react";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  organizations: Organization[];
  classes: { doubleNested: string; doubleNestedHeader: string; doubleNestedList: string };
  name: string;
}

/**
 * Component for organizations with child organizations in the filter menu
 *
 * Props:
 * - filters: the currently applied filters
 * - onFiltersChange: method called when filters are updated
 * - organizations: list of organizations
 * - classes: styled classes
 * - name: name of the parent organization
 */

const SuborganizationFilter: React.FC<Props> = ({ filters, onFiltersChange, organizations, classes, name }) => {
  const [open, setOpen] = useState(false);

  return (
    <List className={classes.doubleNested}>
      <ListItem
        className={classes.doubleNestedHeader}
        button
        onClick={() => {
          setOpen(filters.organization === name ? false : !open);
          onFiltersChange({ ...filters, organization: filters.organization === name ? undefined : name });
        }}
        selected={filters.organization === name}
      >
        <ListItemText primary={name} />
        {open ? <CaretUp size={20} /> : <CaretDown size={20} />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {organizations.map((org: Organization) => (
          <List component="div" disablePadding key={org.name}>
            <ListItem
              button
              className={classes.doubleNestedList}
              selected={filters.organization === org.name}
              onClick={() =>
                onFiltersChange({ ...filters, organization: filters.organization === org.name ? undefined : org.name })
              }
            >
              <ListItemText primary={org.name} />
            </ListItem>
          </List>
        ))}
      </Collapse>
    </List>
  );
};

export default SuborganizationFilter;
