import { useQuery } from "@apollo/client";
import { Checkbox, Grid } from "@mui/material";
import React from "react";

import { graphql } from "@/gql/pages";

type Props = {
  /** The currently applied filters */
  categoryFilters: Record<string, boolean>;
  /** Method called when filters are updated */
  onCategoryFiltersChange: (categoryFilters: Record<string, boolean>) => void;
};

/** Component for the category filter in the filter menu. */
export const CategoryFilter: React.FC<Props> = ({ categoryFilters, onCategoryFiltersChange }) => {
  const { data } = useQuery(
    graphql(`
      query CategoryFilterCategories {
        categories {
          categories {
            id
            name
          }
        }
      }
    `)
  );

  return (
    <Grid container item direction="column">
      {data?.categories.categories.map(
        (category) =>
          category && (
            <Grid key={category.id} container item direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>{category.name}</Grid>
              <Grid item>
                <Checkbox
                  checked={categoryFilters[category.name]}
                  onChange={(e) => {
                    onCategoryFiltersChange({ ...categoryFilters, [category.name]: e.target.checked });
                  }}
                />
              </Grid>
            </Grid>
          )
      )}
    </Grid>
  );
};
