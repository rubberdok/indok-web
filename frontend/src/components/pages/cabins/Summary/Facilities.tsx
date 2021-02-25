import { Box, Container } from "@material-ui/core";
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

const Facilities: React.FC = () => {
  return (
    <>
      <Container>
        {facilitiesData.map((item) => (
          <Box display="inline-block" m="5px" fontSize={fontSize} key={facilitiesData.indexOf(item)}>
            {item.icon} {item.text}
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Facilities;
