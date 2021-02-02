import { ListItemIcon } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import TreeIcon from "@material-ui/icons/AccountTreeOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import PeopleIcon from "@material-ui/icons/PeopleAltOutlined";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    //backgroundColor: theme.palette.background.paper,
    padding: 0,

    "& span": {
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
    },

    "& > div": {
      padding: "12px 24px",
    },
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
    <List component="div" className={classes.root}>
      <ListItem divider button>
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Om oss" />
      </ListItem>
      <ListItem divider button>
        <ListItemIcon>
          <PeopleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Hovedstyret" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <TreeIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Organisasjoner" />
        {/* <Box pt="4px" onClick={handleClick}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </Box> */}
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
