import { useQuery } from "@apollo/client";
import { Filter } from "react-feather";
import { QUERY_EVENT_FILTERED_ORGANIZATIONS } from "@graphql/events/queries";
import React, { useState } from "react";
import { makeStyles, Typography, Container, Button } from "@material-ui/core";
import OrganizationFilter from "./OrganizationFilter";
import { FilterQuery } from "..";
import CategoryFilter from "./CategoryFilter";
import DateTimeFilter from "./DateTimeFilter";

interface Props {
  filters: FilterQuery;
  onChange: (query: FilterQuery) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(0),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  doubleNested: {
    paddingLeft: theme.spacing(2),
  },
  filterContainer: {
    float: "left",
    backgroundColor: "#fff",
    padding: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: "90%",
  },
  headerContainer: {
    padding: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
  },
  buttonsContainer: {
    padding: 0,
    paddingTop: theme.spacing(2),
    width: "fit-content",
  },
  filterButton: {
    backgroundColor: theme.palette.primary,
    float: "left",
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  cancelButton: {
    backgroundColor: theme.palette.secondary,
    float: "left",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

const FilterMenu: React.FC<Props> = ({ filters, onChange }) => {
  const classes = useStyles();
  const [currentFilters, setCurrentFilters] = useState(filters);

  const { loading: organizationLoading, error: organizationError, data: organizationData } = useQuery(
    QUERY_EVENT_FILTERED_ORGANIZATIONS
  );
  if (organizationLoading) return null;
  if (organizationError) return null;

  return (
    <Container className={classes.filterContainer}>
      <Container className={classes.headerContainer}>
        <Filter style={{ marginTop: "0.1em", marginRight: "0.3em", float: "left", color: "#222" }} />
        <Typography variant="body1">Filtre</Typography>
        <hr />
      </Container>

      <OrganizationFilter
        filters={currentFilters}
        onFiltersChange={setCurrentFilters}
        organizations={organizationData.eventFilteredOrganizations}
        name={"Organisasjoner"}
        classes={classes}
      />

      <CategoryFilter filters={currentFilters} onFiltersChange={setCurrentFilters} classes={classes} />

      <DateTimeFilter filters={currentFilters} onFiltersChange={setCurrentFilters} />

      <Container className={classes.buttonsContainer}>
        <Button
          variant="contained"
          color="primary"
          className={classes.cancelButton}
          onClick={() => {
            onChange({});
            setCurrentFilters({});
          }}
        >
          <Typography variant="body1">Nullstill</Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.filterButton}
          onClick={() => onChange(currentFilters)}
        >
          <Typography variant="body1">Filtrer</Typography>
        </Button>
      </Container>
    </Container>
  );
};

export default FilterMenu;
