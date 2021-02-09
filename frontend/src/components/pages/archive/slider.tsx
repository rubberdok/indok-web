import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { ContentWrapper } from "./wrapper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

function ValueLabelComponent(props: { children: any; open: any; value: any }) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const PrettoSlider = withStyles({
  root: {
    color: "#065a5a",
    height: 8,
  },
  thumb: {
    height: 42,
    width: 42,
    backgroundColor: "#065a5a",
    border: "2px solid currentColor",
    marginTop: -19,
    marginLeft: -14,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-10% + 6px)",
    top: "calc(11px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function convertYear(year: number | null) {
  if (year === null) {
    return new Date().getFullYear();
  } else {
    return year;
  }
}

interface SliderProps {
  yearFilter: number | null;
  updateYearFilters: (value: number | null) => void;
}
const SliderSelector: React.FC<SliderProps> = ({ yearFilter, updateYearFilters }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ContentWrapper style={{ justifyContent: "space-between" }}>
        <PrettoSlider
          valueLabelDisplay="on"
          aria-label="pretto slider"
          track={false}
          defaultValue={new Date().getFullYear()}
          min={1986}
          max={new Date().getFullYear()}
          value={convertYear(yearFilter)}
          onChange={(_, value) => typeof value === "number" && updateYearFilters(value)}
        />
      </ContentWrapper>
      <Typography style={{ marginTop: "-28px", marginLeft: "-70px", fontSize: "14px" }} gutterBottom>
        Velg år
      </Typography>
      <Typography style={{ marginTop: "-34px", marginLeft: "400px", fontSize: "20px" }} gutterBottom></Typography>
      <div className={classes.margin} />
    </div>
  );
};

export default SliderSelector;
