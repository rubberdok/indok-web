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
};

interface Checkbox {
  organization: Organization,
  checked: boolean,
  count: number,
};


const Filter: React.FC<FilterProps> = ({ organizations }) => {
  const checkboxes: Record<string, Checkbox> = organizations.reduce((accumulator, organization) => {
    const count: number = (accumulator[organization.id] && accumulator[organization.id].count) || 0;
    accumulator[organization.id] = {organization: organization, checked: false, count: count + 1};
    return accumulator;
  }, {} as Record<string, Checkbox>)

  const [toggled, setToggle] = useState(false);
  const [filtered, setFiltered] = useState(checkboxes);
  const toggle = (e) => setToggle(!toggled);
  console.log(filtered)

  const handleChange = (event) => {
    setFiltered({...filtered, [event.target.name] : {...filtered[event.target.name], checked: event.target.checked} });
  }
/*
  const ids: string[] = organizations.map(organization => (organization.id))
  console.log(ids)
  const checkboxes: Checkbox[] = organizations
    .filter((organization, index) => !ids.includes(organization.id, index + 1))
    .map((organization) => ({organization: organization, checked: false}));
*/

  const classes = useStyles();
  return (
    <>
      <Box>
        <Button onClick={toggle} className={classes.button}>
          Filter {`${toggled}`}
        </Button>
        {toggled &&
          <Paper className={classes.filterMenu}>
            <Typography variant="h5" component="h3">
              Filter bla bla bla bal
            </Typography>
            {checkboxes &&
              <FormGroup>
                {Object.entries(checkboxes).map(([key, checkbox]) => (
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label={`${checkbox.organization.name} (${checkbox.count})`}
                    checked={filtered[checkbox.organization.id].checked}
                    name={checkbox.organization.id}
                    onChange={handleChange}
                  />
                ))
                }
              </FormGroup>
            } 
            <Button onClick={toggle}>
              Filtrer
            </Button>
            <Button onClick={toggle}>
              Close
            </Button>
          </Paper>
        }
      </Box>
    </>
  )
}

export default Filter;