import { Refresh } from "@mui/icons-material";
import { Card, CardContent, Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";

import { CategoryFilter } from "./CategoryFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { OrganizationFilter } from "./OrganizationFilter";

export type Filters = {
  organizations: Record<string, boolean>;
  categories: Record<string, boolean>;
  dateTime: {
    startAt?: string;
    endAt?: string;
  };
};

type Props = {
  /** The currently applied filters */
  filters: Filters;
  /** Function called when filters are updated */
  onFiltersChange: (query: Filters) => void;
};

/** Component for the filter menu on the event list page. */
export const FilterMenu: React.FC<Props> = ({ filters, onFiltersChange }) => {
  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={3}>
          <Grid container item direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">Filter</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Nullstill filter" arrow>
                <IconButton
                  onClick={() => onFiltersChange({ organizations: {}, categories: {}, dateTime: {} })}
                  aria-label="delete"
                >
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
            organizationsFilter={filters.organizations}
            onOrganizationsFilterChange={(organizations) => onFiltersChange({ ...filters, organizations })}
          />

          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Kategori</Typography>
          </Grid>
          <CategoryFilter
            categoryFilters={filters.categories}
            onCategoryFiltersChange={(categories) => onFiltersChange({ ...filters, categories })}
          />

          <Grid item>
            <Divider />
          </Grid>
          <DateTimeFilter
            dateTimeFilter={filters.dateTime}
            onDateTimeFilterChange={(dateTime) => onFiltersChange({ ...filters, dateTime })}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};
