import { useQuery } from "@apollo/client";
import { Checkbox, Grid, Skeleton, Typography } from "@mui/material";
import { compact, range, uniq } from "lodash";
import React from "react";

import { graphql } from "@/gql/pages";

type Props = {
  /** The currently applied filters */
  organizationsFilter?: { id: string }[] | null;
  /** Function called when filters are updated */
  onOrganizationsFilterChange: (organizations: { id: string }[]) => void;
};

/** Component for the organization filter in the filter menu. */
export const OrganizationFilter: React.FC<Props> = ({ organizationsFilter, onOrganizationsFilterChange }) => {
  const { data, loading, error } = useQuery(
    graphql(`
      query EventOrganizationFilter {
        events(data: { futureEventsOnly: true }) {
          events {
            id
            organization {
              id
              name
            }
          }
        }
      }
    `)
  );

  const organizations = data?.events.events.map((event) => event.organization);
  const uniqueOrganizations = uniq(compact(organizations));

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
  const organizationsById = organizationsFilter
    ? Object.fromEntries(organizationsFilter?.map((organization) => [organization.id, organization]))
    : {};

  return (
    <Grid container item direction="column">
      {uniqueOrganizations.map((organization) => (
        <Grid container item direction="row" justifyContent="space-between" alignItems="center" key={organization?.id}>
          <Grid item>
            <Typography variant="body1">{organization?.name}</Typography>
          </Grid>
          <Grid item>
            <Checkbox
              checked={Boolean(organizationsById[organization.id])}
              onChange={(e) => {
                const prevFilters = organizationsFilter ?? [];
                let newFilters;
                if (e.target.checked) {
                  newFilters = [...prevFilters, { id: organization.id }];
                } else {
                  newFilters = prevFilters.filter((c) => c.id !== organization.id);
                }
                onOrganizationsFilterChange(newFilters);
              }}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
