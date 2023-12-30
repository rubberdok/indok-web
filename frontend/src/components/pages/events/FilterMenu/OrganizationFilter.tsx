import { useQuery } from "@apollo/client";
import { Checkbox, Grid, Skeleton, Typography } from "@mui/material";
import { range } from "lodash";
import React from "react";

import { EventFilteredOrganizationsDocument } from "@/generated/graphql";

import { FilterQuery } from "../AllEvents";

import { HandleChecked } from "./types";

type Props = {
  /** The currently applied filters */
  filters: FilterQuery;
  /** Function called when filters are updated */
  handleChecked: HandleChecked;
};

/** Component for the organization filter in the filter menu. */
export const OrganizationFilter: React.FC<Props> = ({ filters, handleChecked }) => {
  const { data, loading, error } = useQuery(EventFilteredOrganizationsDocument);

  if (loading) {
    return (
      <Grid container item justifyContent="space-between" spacing={2}>
        {range(0, 3).map((val) => (
          <Grid item xs={12} key={val}>
            <Skeleton variant="rectangular" width="100%">
              <Typography>Laster...</Typography>
            </Skeleton>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid item sx={{ color: (theme) => theme.vars.palette.error.main }}>
        <Typography variant="body1">Noe gikk galt</Typography>
      </Grid>
    );
  }

  return (
    <Grid container item direction="column">
      {data?.eventFilteredOrganizations?.map((organization) => (
        <Grid container item direction="row" justifyContent="space-between" alignItems="center" key={organization.id}>
          <Grid item>
            <Typography variant="body1">{organization.name}</Typography>
          </Grid>
          <Grid item>
            <Checkbox
              checked={filters.organization === organization.name}
              onChange={(e) => handleChecked(e, "organization", organization.name)}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
