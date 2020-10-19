import { Box, Composition } from "atomic-layout";
import React from "react";
import styled from "styled-components";

interface ItemProps {
    imageUrl: string;
    subtitle: string;
    title: string;
}

const Item: React.FC<ItemProps> = (props) => {
  return (
    <Composition
      as={Container}
      areas={templateMobile}
      templateMd={templateDesktop}
      templateColsLg="120px 1fr auto"
      alignItems="center"
      gap={30}
      gapMd={20}
      gapLg={25}
      maxWidthSmDown={200}
    >
      {Areas => (
        <>
          <Areas.Image
            as={Image}
            src={props.imageUrl}
            alt="Painting of Vigorous Squares"
          />
          <Areas.Description padding="30px 30px 30px 15px">
            <ItemTitle>{props.title}</ItemTitle>
            <Box as={ItemSubtitle} margin="10px 0 0">
              {props.subtitle}
            </Box>
          </Areas.Description>
          <Areas.Actions>
          </Areas.Actions>
        </>
      )}
    </Composition>
  );
};

const Image = styled.img`
  max-width: 100%;
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
  image actions
  description description
`;

const templateDesktop = `
image description actions
/ 0 1fr auto
`;

export default Item;