import { useQuery } from "@apollo/client";
import { Checkbox, Grid, Skeleton, Typography } from "@mui/material";
import { compact, range, uniq } from "lodash";
import React from "react";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";

type Props = {
  /** The currently applied filters */
  organizationsFilter?: { id: string }[] | null;
  /** Function called when filters are updated */
  onOrganizationsFilterChange: (organizations: { id: string }[]) => void;
  query: FragmentType<typeof OrganizationFilterQueryFragment>;
};

const OrganizationFilterQueryFragment = graphql(`
  fragment OrganizationFilter_Query on Query {
    organizationEvents: events(data: { futureEventsOnly: true }) {
      events {
        id
        organization {
          id
          name
        }
      }
    }
  }
`);

/** Component for the organization filter in the filter menu. */
export const OrganizationFilter: React.FC<Props> = ({ organizationsFilter, onOrganizationsFilterChange, query }) => {
  const organizations = getFragmentData(OrganizationFilterQueryFragment, query).organizationEvents.events.map(
    (event) => event.organization
  );
  const uniqueOrganizations = uniq(compact(organizations));
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
