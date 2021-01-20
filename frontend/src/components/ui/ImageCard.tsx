import { Box, Composition } from "atomic-layout";
import React from "react";
import styled from "styled-components";

interface ImageCardProps {
  imageUrl: string;
  subtitle: string;
  title: string;
}

const ImageCard: React.FC<ImageCardProps> = (props) => (
  <Composition
    as={Container}
    areas={templateMobile}
    areasMd={templateTablet}
    areasLg={templateDesktop}
    templateColsMd="auto"
    templateCols="120px 1fr auto"
    templateColsLg="120px 1fr auto"
    alignItems="center"
    gap={30}
    gapMd={20}
    gapLg={25}
  >
    {(Areas) => (
      <>
        <Areas.Image as={Image} src={props.imageUrl} alt="Bilde" />
        <Areas.Description padding="30px 30px 30px 15px">
          <ItemTitle>{props.title}</ItemTitle>
          <Box as={ItemSubtitle} margin="10px 0 0">
            {props.subtitle}
          </Box>
        </Areas.Description>
        <Areas.Actions></Areas.Actions>
      </>
    )}
  </Composition>
);

const Image = styled.img`
  height: 100%;
  object-fit: cover;
`;

const Container = styled.div`
  background-color: #fff;
  box-shadow: 0px 15px 34px -18px #00000029;
`;

const ItemTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ItemSubtitle = styled.p`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
`;

const templateMobile = `
  image description
`;

const templateTablet = `
  image
  description
`;

const templateDesktop = `
  image description actions
`;

export default ImageCard;
