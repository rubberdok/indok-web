import { useQuery } from "@apollo/client";
import { Filter, RotateCcw } from "react-feather";
import { QUERY_EVENT_FILTERED_ORGANIZATIONS } from "@graphql/events/queries";
import React, { useState } from "react";
import { makeStyles, Tooltip, Container, IconButton, List, ListItem, ListItemText } from "@material-ui/core";
import { StarRounded, StarBorderRounded } from "@material-ui/icons";
import OrganizationFilter from "./OrganizationFilter";
import { FilterQuery } from "..";
import CategoryFilter from "./CategoryFilter";
import DateTimeFilter from "./DateTimeFilter";

interface Props {
  filters: FilterQuery;
  onFiltersChange: (query: FilterQuery) => void;
  showDefaultEvents: boolean;
  onShowDefaultChange: (show: boolean) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(0),
  },
  nested: {
    padding: 0,
    margin: 0,
    paddingLeft: theme.spacing(4),
    ["&.Mui-selected"]: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      ["&:hover"]: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  doubleNestedList: {
    padding: 0,
    margin: 0,
    paddingLeft: theme.spacing(6),
    ["&.Mui-selected"]: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      ["&:hover"]: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  doubleNested: {
    padding: 0,
  },
  doubleNestedHeader: {
    padding: 0,
    paddingLeft: theme.spacing(4),
    ["&.Mui-selected"]: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      ["&:hover"]: {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  filterContainer: {
    float: "left",
    backgroundColor: "#fff",
    padding: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    maxWidth: "90%",
  },
  headerContainer: {
    padding: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
  },
  deleteButton: {
    padding: 0,
    margin: 0,
  },
  badge: { marginRight: theme.spacing(1.5) },
  tooltip: {
    margin: 0,
    padding: 0,
  },
  simple: {
    padding: 0,
  },
}));

const FilterMenu: React.FC<Props> = ({ filters, onFiltersChange, showDefaultEvents, onShowDefaultChange }) => {
  const classes = useStyles();

  const { loading: organizationLoading, error: organizationError, data: organizationData } = useQuery(
    QUERY_EVENT_FILTERED_ORGANIZATIONS
  );
  if (organizationLoading) return null;
  if (organizationError) return null;

  return (
    <Container className={classes.filterContainer}>
      <Container className={classes.headerContainer}>
        <List component="div" disablePadding>
          <ListItem className={classes.simple}>
            <Filter style={{ marginTop: "0.1em", marginRight: "0.3em", float: "left", color: "#222" }} />
            <ListItemText primary={"Filtre"} />
            <Tooltip className={classes.tooltip} title="Nullstill filtre" arrow>
              <IconButton disableFocusRipple disableRipple onClick={() => onFiltersChange({})} aria-label="delete">
                <RotateCcw style={{ color: "#222" }} />
              </IconButton>
            </Tooltip>
          </ListItem>
        </List>

        <hr style={{ margin: 0, marginTop: "0.2em" }} />
      </Container>

      <List component="div" disablePadding>
        <ListItem
          button
          onClick={() => {
            onShowDefaultChange(!showDefaultEvents);
            onFiltersChange({});
          }}
        >
          <ListItemText primary={"Fremhevet"} />
          {showDefaultEvents ? (
            <StarRounded style={{ color: "#ffe100" }} />
          ) : (
            <StarBorderRounded style={{ color: "#ffe100" }} />
          )}
        </ListItem>
      </List>

      <OrganizationFilter
        filters={filters}
        onFiltersChange={onFiltersChange}
        organizations={organizationData.eventFilteredOrganizations}
        name={"Organisasjoner"}
        classes={classes}
      />

      <CategoryFilter filters={filters} onFiltersChange={onFiltersChange} classes={classes} />

      <DateTimeFilter filters={filters} onFiltersChange={onFiltersChange} />
    </Container>
  );
};

export default FilterMenu;
