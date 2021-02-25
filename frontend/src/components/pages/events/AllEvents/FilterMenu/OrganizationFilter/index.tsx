import { Organization } from "@interfaces/organizations";
import React, { useState } from "react";
import { List, ListItem, ListItemText, Collapse, Badge } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { FilterQuery } from "../..";
import SuborganizationFilter from "./SuborganizationFilter";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  organizations: Organization[];
  name: string;
  classes: any;
}

const OrganizationFilter: React.FC<Props> = ({ filters, onFiltersChange, organizations, classes }) => {
  const [open, setOpen] = useState(false);

  return (
    <List component="div" className={classes.root} disablePadding>
      <ListItem button onClick={() => setOpen(!open)} selected={open}>
        <ListItemText primary={"Organisasjoner"} />
        <Badge className={classes.badge} badgeContent={1} color="primary" invisible={!filters.organization} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {organizations.map((org: Organization) => (
          <List component="div" disablePadding key={org.name}>
            {org.children && org.children.length > 0 ? (
              <SuborganizationFilter
                filters={filters}
                onFiltersChange={onFiltersChange}
                name={org.name}
                organizations={org.children}
                classes={classes}
              />
            ) : (
              <ListItem
                disablePadding
                button
                className={classes.nested}
                selected={filters.organization === org.name}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    organization: filters.organization === org.name ? undefined : org.name,
                  })
                }
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
