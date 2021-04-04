import { Organization } from "@interfaces/organizations";
import { Button, Paper, Box, makeStyles, Typography, Checkbox, Grid, FormGroup, FormControlLabel } from "@material-ui/core"
import { collectFields } from "graphql/execution/execute";
import { MapHTMLAttributes, useState } from "react";

const useStyles = makeStyles((theme) => ({
  filterMenu: {
    position: "absolute",
    padding: theme.spacing(2),
    zIndex: theme.zIndex.modal,
  },
  button: {
    position: "absolute",
  }
}));

interface FilterProps {
  organizations: Organization[],
  filtered: string[]
  handleChange: (event) => void,
  handleReset: (event) => void,
};

const Filter: React.FC<FilterProps> = ({ organizations, filtered, handleChange, handleReset }) => {
  const classes = useStyles();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <Box>
        <Button className={classes.button} onClick={(e) => setShowFilter(!showFilter)}>
          Filter
        </Button>
        {showFilter &&
          <Paper className={classes.filterMenu}>
            <Typography variant="h5" component="h3">
              Filter
            </Typography>
            {organizations &&
              <FormGroup>
                {Array.from(new Set(organizations)).map(organization => (
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label={organization.name}
                    checked={filtered.includes(organization.id) || false}
                    name={organization.id}
                    onChange={handleChange}
                    key={organization.id}
                  />
                ))
                }
              </FormGroup>
            } 
            <Button onClick={handleReset}>
              Reset
            </Button>
          </Paper>
        }
      </Box>
    </>
  )
}

export default Filter;