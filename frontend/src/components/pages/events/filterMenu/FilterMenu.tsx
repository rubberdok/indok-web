import { useQuery } from "@apollo/client";
import { QUERY_EVENT_FILTERED_ORGANIZATIONS } from "@graphql/events/queries";
import { IconButton, List, ListItem, ListItemText, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Refresh, StarBorderRounded, StarRounded } from "@material-ui/icons";
import React from "react";
import { FilterQuery } from "../AllEvents";
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

const FilterMenu: React.FC<Props> = ({ filters, onFiltersChange, showDefaultEvents, onShowDefaultChange }) => {
  const classes = useStyles();

  const { loading: organizationLoading, error: organizationError, data: organizationData } = useQuery(
    QUERY_EVENT_FILTERED_ORGANIZATIONS
  );
  if (organizationLoading) return null;
  if (organizationError) return null;

  return (
    <>
      <List>
        <ListItem>
          <ListItemText primary={<Typography variant="h4">Filtre</Typography>} />
          <Tooltip className={classes.tooltip} title="Nullstill filtre" arrow>
            <IconButton disableFocusRipple disableRipple onClick={() => onFiltersChange({})} aria-label="delete">
              <Refresh />
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
          {showDefaultEvents ? <StarRounded /> : <StarBorderRounded />}
        </ListItem>

        <OrganizationFilter
          filters={filters}
          onFiltersChange={onFiltersChange}
          organizations={organizationData.eventFilteredOrganizations}
          name={"Organisasjoner"}
          classes={classes}
        />

        <CategoryFilter filters={filters} onFiltersChange={onFiltersChange} classes={classes} />

        <DateTimeFilter filters={filters} onFiltersChange={onFiltersChange} />
      </List>
    </>
  );
};

export default FilterMenu;
