import { Organization } from "@interfaces/organizations";
import React, { useState } from "react";
import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { FilterQuery } from "../../..";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  organizations: Organization[];
  classes: any;
  name: string;
}

const SuborganizationFilter: React.FC<Props> = ({ filters, onFiltersChange, organizations, classes, name }) => {
  const [open, setOpen] = useState(false);

  return (
    <List component="div" className={classes.doubleNested} disablePadding>
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
        {open ? <ExpandLess /> : <ExpandMore />}
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
