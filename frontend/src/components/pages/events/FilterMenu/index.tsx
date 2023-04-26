import { Refresh, StarOutlineRounded, StarRounded } from "@mui/icons-material";
import { Card, CardContent, Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";

import { FilterQuery } from "../AllEvents";

import { CategoryFilter } from "./CategoryFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { OrganizationFilter } from "./OrganizationFilter";
import { HandleChecked } from "./types";

type Props = {
  /** The currently applied filters */
  filters: FilterQuery;
  /** Function called when filters are updated */
  onFiltersChange: (query: FilterQuery) => void;
  /** Whether to show the default event or all (possibly filtered) events */
  showDefaultEvents: boolean;
  /** Called when whether to show default events or not changes */
  onShowDefaultChange: (show: boolean) => void;
};

/** Component for the filter menu on the event list page. */
export const FilterMenu: React.FC<Props> = ({ filters, onFiltersChange, showDefaultEvents, onShowDefaultChange }) => {
  const handleChecked: HandleChecked = (e, field, filter) => {
    if (e.target.checked) {
      onFiltersChange({ ...filters, [field]: filter });
    } else {
      onFiltersChange({ ...filters, [field]: undefined });
    }
  };
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
                <IconButton onClick={() => onFiltersChange({})} aria-label="delete">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid container item direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body1">Fremhevet</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => onShowDefaultChange(!showDefaultEvents)} aria-label="delete">
                {showDefaultEvents ? <StarRounded color="warning" /> : <StarOutlineRounded />}
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Arrangør</Typography>
          </Grid>
          <OrganizationFilter filters={filters} handleChecked={handleChecked} />

          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Kategori</Typography>
          </Grid>
          <CategoryFilter filters={filters} handleChecked={handleChecked} />

          <Grid item>
            <Divider />
          </Grid>
          <DateTimeFilter filters={filters} onFiltersChange={onFiltersChange} />
        </Grid>
      </CardContent>
    </Card>
  );
};
