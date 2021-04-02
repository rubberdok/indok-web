import { Organization } from "@interfaces/organizations";
import { Badge, Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
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
    <>
      <ListItem button onClick={() => setOpen(!open)} selected={open}>
        <ListItemText primary={"Arrangert av"} />
        <Badge className={classes.badge} badgeContent={1} color="primary" invisible={!filters.organization} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {organizations.map((org: Organization) => (
          <List disablePadding key={org.name}>
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
    </>
  );
};

export default OrganizationFilter;
