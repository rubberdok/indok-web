import { Checkbox, Grid } from "@mui/material";
import React from "react";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";

type Props = {
  /** The currently applied filters */
  categoryFilters?: { id: string }[] | null;
  /** Method called when filters are updated */
  onCategoryFiltersChange: (categoryFilters: { id: string }[]) => void;
  query: FragmentType<typeof CategoryFilterQueryFragment>;
};

const CategoryFilterQueryFragment = graphql(`
  fragment CategoryFilter_Query on Query {
    categories {
      categories {
        id
        name
      }
    }
  }
`);

/** Component for the category filter in the filter menu. */
export const CategoryFilter: React.FC<Props> = ({ categoryFilters, onCategoryFiltersChange, query }) => {
  const {
    categories: { categories },
  } = getFragmentData(CategoryFilterQueryFragment, query);

  const categoriesById = categoryFilters
    ? Object.fromEntries(categoryFilters?.map((category) => [category.id, category]))
    : {};

  return (
    <Grid container item direction="column">
      {categories.map(
        (category) =>
          category && (
            <Grid key={category.id} container item direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>{category.name}</Grid>
              <Grid item>
                <Checkbox
                  checked={Boolean(categoriesById[category.id])}
                  onChange={(e) => {
                    const prevFilters = categoryFilters ?? [];
                    let newFilters;
                    if (e.target.checked) {
                      newFilters = [...prevFilters, { id: category.id }];
                    } else {
                      newFilters = prevFilters.filter((c) => c.id !== category.id);
                    }
                    onCategoryFiltersChange(newFilters);
                  }}
                />
              </Grid>
            </Grid>
          )
      )}
    </Grid>
  );
};
