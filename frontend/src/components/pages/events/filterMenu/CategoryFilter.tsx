import { useQuery } from "@apollo/client";
import { Checkbox, Grid } from "@mui/material";
import React from "react";

import { FilterQuery } from "@/components/pages/events/AllEvents";
import { AllCategoriesDocument } from "@/generated/graphql";

import { HandleChecked } from "./types";

type Props = {
  filters: FilterQuery;
  handleChecked: HandleChecked;
};

/**
 * Component for the category filter in the filter menu
 *
 * Props:
 * - filters: the currently applied filters
 * - handleChecked: method called when filters are updated
 * - classes: styled classes
 */

const CategoryFilter: React.FC<Props> = ({ filters, handleChecked }) => {
  const { data } = useQuery(AllCategoriesDocument);

  return (
    <Grid container item direction="column">
      {data?.allCategories?.map(
        (category) =>
          category && (
            <Grid key={category.id} container item direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>{category.name}</Grid>
              <Grid item>
                <Checkbox
                  checked={filters.category === category.name}
                  onChange={(e) => handleChecked(e, "category", category.name)}
                />
              </Grid>
            </Grid>
          )
      )}
    </Grid>
  );
};

export default CategoryFilter;
