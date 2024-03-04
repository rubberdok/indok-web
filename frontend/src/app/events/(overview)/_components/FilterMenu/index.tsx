import { Refresh } from "@mui/icons-material";
import { Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { CategoryFilter } from "./CategoryFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { OrganizationFilter } from "./OrganizationFilter";

export type Filters = {
  organizations?: { id: string }[] | null;
  categories?: { id: string }[] | null;
  startAfter?: string | null;
  endBefore?: string | null;
};

type Props = {
  /** The currently applied filters */
  filters: Filters | null;
  /** Function called when filters are updated */
  onFiltersChange: (query: Filters | null) => void;
  query: FragmentType<typeof FilterMenuQueryFragment>;
};

const FilterMenuQueryFragment = graphql(`
  fragment FilterMenu_Query on Query {
    ...OrganizationFilter_Query
    ...CategoryFilter_Query
  }
`);

/** Component for the filter menu on the event list page. */
export const FilterMenu: React.FC<Props> = ({ filters, onFiltersChange, ...props }) => {
  const query = getFragmentData(FilterMenuQueryFragment, props.query);
  return (
    <Grid container direction="column" spacing={3}>
      <Grid container item direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="subtitle2">Nullstill</Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Nullstill filter" arrow>
            <IconButton onClick={() => onFiltersChange(null)} aria-label="delete">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <Typography variant="subtitle2">Arrangør</Typography>
      </Grid>
      <OrganizationFilter
        organizationsFilter={filters?.organizations}
        onOrganizationsFilterChange={(organizations) => onFiltersChange({ ...filters, organizations })}
        query={query}
      />

      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <Typography variant="subtitle2">Kategori</Typography>
      </Grid>
      <CategoryFilter
        categoryFilters={filters?.categories}
        onCategoryFiltersChange={(categories) => onFiltersChange({ ...filters, categories })}
        query={query}
      />

      <Grid item>
        <Divider />
      </Grid>
      <DateTimeFilter
        endBeforeFilter={filters?.endBefore}
        startAfterFilter={filters?.startAfter}
        onDateTimeFilterChange={({ startAfter, endBefore }) => onFiltersChange({ ...filters, startAfter, endBefore })}
      />
    </Grid>
  );
};
