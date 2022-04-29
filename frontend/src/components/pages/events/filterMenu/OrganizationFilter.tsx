import { FilterQuery } from "@components/pages/events/AllEvents";
import { Organization } from "@interfaces/organizations";
import { Badge, Collapse, List, ListItem, ListItemText } from "@mui/material";
import { CaretDown, CaretUp } from "phosphor-react";
import React, { useState } from "react";
import SuborganizationFilter from "./SubOrganizationFilter";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  organizations: Organization[];
  classes: {
    badge: string;
    nested: string;
    doubleNested: string;
    doubleNestedHeader: string;
    doubleNestedList: string;
  };
}

/**
 * Component for the organization filter in the filter menu
 *
 * Props:
 * - filters: the currently applied filters
 * - onFiltersChange: method called when filters are updated
 * - organizations: list of organizations
 * - classes: styled classes
 */

const OrganizationFilter: React.FC<Props> = ({ filters, onFiltersChange, organizations, classes }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)} selected={open}>
        <ListItemText primary={"Arrangert av"} />
        <Badge className={classes.badge} badgeContent={1} color="primary" invisible={!filters.organization} />
        {open ? <CaretUp size={20} /> : <CaretDown size={20} />}
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
