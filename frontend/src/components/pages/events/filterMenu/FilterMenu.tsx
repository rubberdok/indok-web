import { useQuery } from "@apollo/client";
import { FilterQuery } from "@components/pages/events/AllEvents";
import { QUERY_EVENT_FILTERED_ORGANIZATIONS } from "@graphql/events/queries";
import { IconButton, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { ArrowCounterClockwise, Star } from "phosphor-react";
import React from "react";
import CategoryFilter from "./CategoryFilter";
import DateTimeFilter from "./DateTimeFilter";
import OrganizationFilter from "./OrganizationFilter";

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
    paddingRight: theme.spacing(2),
    ["&.Mui-selected"]: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      ["&:hover"]: {
        backgroundColor: theme.palette.primary.main,
      },
    },
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
}));

/**
 * Component for the filter menu on the event list page
 *
 * Props:
 * - filters: the currently applied filters
 * - onFiltersChange: method called when filters are updated
 * - showDefaultEvents: whether to show the default event or all (possibly filtered) events
 * - onShowDefaultChange: method called when whether to show default events or not changes
 */

const FilterMenu: React.FC<Props> = ({ filters, onFiltersChange, showDefaultEvents, onShowDefaultChange }) => {
  const classes = useStyles();

  const {
    loading: organizationLoading,
    error: organizationError,
    data: organizationData,
  } = useQuery(QUERY_EVENT_FILTERED_ORGANIZATIONS);
  if (organizationLoading) return null;
  if (organizationError) return null;

  return (
    <>
      <List>
        <ListItem>
          <ListItemText primary={<Typography variant="h4">Filtre</Typography>} />
          <Tooltip className={classes.tooltip} title="Nullstill filtre" arrow>
            <IconButton disableFocusRipple disableRipple onClick={() => onFiltersChange({})} aria-label="delete">
              <ArrowCounterClockwise />
            </IconButton>
          </Tooltip>
        </ListItem>

        <ListItem
          button
          onClick={() => {
            onShowDefaultChange(!showDefaultEvents);
            onFiltersChange({});
          }}
        >
          <ListItemText primary={"Fremhevet"} />
          {showDefaultEvents ? <Star size={20} weight="fill" /> : <Star size={20} />}
        </ListItem>

        <OrganizationFilter
          filters={filters}
          onFiltersChange={onFiltersChange}
          organizations={organizationData.eventFilteredOrganizations}
          classes={classes}
        />

        <CategoryFilter filters={filters} onFiltersChange={onFiltersChange} classes={classes} />

        <DateTimeFilter filters={filters} onFiltersChange={onFiltersChange} />
      </List>
    </>
  );
};

export default FilterMenu;
