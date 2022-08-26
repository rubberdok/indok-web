import { ThemeOptions } from "@mui/material";
import Accordion from "./Accordion";
import Alert from "./Alert";
import Autocomplete from "./Autocomplete";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import ButtonGroup from "./ButtonGroup";
import Card from "./Card";
import Checkbox from "./Checkbox";
import Chip from "./Chip";
import Container from "./Container";
import ControlLabel from "./ControlLabel";
import CssBaseline from "./CssBaseline";

const components: ThemeOptions["components"] = {
  ...Accordion,
  ...Alert,
  ...Autocomplete,
  ...Avatar,
  ...Badge,
  ...Button,
  ...ButtonGroup,
  ...Card,
  ...Checkbox,
  ...Chip,
  ...Container,
  ...ControlLabel,
  ...CssBaseline,
};

export default components;
