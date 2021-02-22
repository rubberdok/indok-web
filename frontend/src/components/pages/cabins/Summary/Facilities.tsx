import { Container, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Speaker } from "react-feather";
import { FaBed, FaLightbulb, FaThermometerFull, FaUtensils, FaWifi } from "react-icons/fa";

const fontSize = 14;

const facilitiesData = [
  {
    icon: <FaWifi size={fontSize} />,
    text: "Trådløst internett",
  },
  {
    icon: <FaThermometerFull size={fontSize} />,
    text: "Varmekabler",
  },
  {
    icon: <FaLightbulb size={fontSize} />,
    text: "Innlagt strøm",
  },
  {
    icon: <Speaker size={fontSize} />,
    text: "Høyttaleranlegg",
  },
  {
    icon: <FaBed size={fontSize} />,
    text: "20 soveplasser",
  },
  {
    icon: <FaUtensils size={fontSize} />,
    text: "Kjøkken",
  },
];

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      display: "inline-block",
      margin: "5px",
      fontSize: fontSize + "px",
    },
  })
);

const Facilities: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Container>
        {facilitiesData.map((item) => (
          <div className={classes.container} key={facilitiesData.indexOf(item)}>
            {item.icon} {item.text}
          </div>
        ))}
      </Container>
    </>
  );
};

export default Facilities;
