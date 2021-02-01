import { Organization } from "@interfaces/organizations";
import React, { useState } from "react";
import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { FilterQuery } from "../..";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  organizations: Organization[];
  name: string;
  classes: any;
}

const OrganizationFilter: React.FC<Props> = ({ filters, onFiltersChange, organizations, name, classes }) => {
  const [open, setOpen] = useState(false);

  return (
    <List component="div" className={classes.root} disablePadding>
      <ListItem
        button
        onClick={() => {
          !open && name !== "Organisasjoner" && onFiltersChange({ ...filters, organization: name });
          setOpen(!open);
        }}
        selected={(open && name == "organisajsoner") || filters.organization === name}
      >
        <ListItemText primary={name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {organizations.map((org: Organization) => (
          <List component="div" disablePadding key={org.name}>
            {org.children && org.children.length > 0 ? (
              <div className={classes.doubleNested}>
                <OrganizationFilter
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  name={org.name}
                  organizations={org.children}
                  classes={classes}
                />
              </div>
            ) : (
              <ListItem
                disablePadding
                button
                className={classes.nested}
                selected={filters.organization === org.name}
                onClick={() => onFiltersChange({ ...filters, organization: org.name })}
              >
                <ListItemText primary={org.name} />
              </ListItem>
            )}
          </List>
        ))}
      </Collapse>
    </List>
  );
};

export default OrganizationFilter;
