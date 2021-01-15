import styled from "styled-components";
import { Wifi, Thermometer, Zap, Speaker } from "react-feather";

import { FaBed, FaWifi, FaThermometerFull, FaLightbulb, FaUtensils } from "react-icons/fa";

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

const Facilities = (): JSX.Element => {
  return (
    <>
      <Container>
        {facilitiesData.map((item) => (
          <Item key={facilitiesData.indexOf(item)}>
            {item.icon} {item.text}
          </Item>
        ))}
      </Container>
    </>
  );
};

export default Facilities;

const Container = styled.div`
  width: 80%;
  margin: auto;
`;

const Item = styled.div`
  display: inline-block;
  margin: 5px;

  font-size: ${fontSize}px;
`;
