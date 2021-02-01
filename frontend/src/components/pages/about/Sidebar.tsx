import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      <ListItem button>
        <ListItemText primary="Om oss" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Hovedstyret" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Organisasjonskart" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Bindeleddet" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="ESTIEM" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="hyttestyret" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Janus IF" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Janus" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Kultur" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}
