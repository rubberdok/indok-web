import { useQuery } from "@apollo/client";
import { FilterQuery } from "@components/pages/events/AllEvents";
import { GET_CATEGORIES } from "@graphql/events/queries";
import { Category } from "@interfaces/events";
import { Badge, Collapse, List, ListItem, ListItemText } from "@mui/material";
import { CaretDown, CaretUp } from "phosphor-react";
import React, { useState } from "react";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  classes: { badge: string; nested: string };
}

/**
 * Component for the category filter in the filter menu
 *
 * Props:
 * - filters: the currently applied filters
 * - onFiltersChange: method called when filters are updated
 * - classes: styled classes
 */

const CategoryFilter: React.FC<Props> = ({ filters, onFiltersChange, classes }) => {
  const [open, setOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_CATEGORIES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)} selected={open}>
        <ListItemText primary={"Type arrangement"} />
        <Badge className={classes.badge} badgeContent={1} color="primary" invisible={!filters.category} />

        {open ? <CaretUp size={20} /> : <CaretDown size={20} />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {data.allCategories.map((category: Category) => (
            <ListItem
              key={category.name}
              button
              className={classes.nested}
              selected={filters.category === category.name}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  category: category.name === filters.category ? undefined : category.name,
                })
              }
            >
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default CategoryFilter;
