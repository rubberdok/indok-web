import { useQuery } from "@apollo/client";
import { FilterQuery } from "@components/pages/events/AllEvents";
import { GET_CATEGORIES } from "@graphql/events/queries";
import { Category } from "@interfaces/events";
import { Badge, Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  classes: any;
}

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

        {open ? <ExpandLess /> : <ExpandMore />}
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
