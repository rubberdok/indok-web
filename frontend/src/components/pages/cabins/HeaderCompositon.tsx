import { CompositionProps } from "@atomic-layout/core";
import { ArrowIcon } from "@components/ui/ArrowIcon";
import { Composition } from "atomic-layout";
import React, { Fragment } from "react";
import styled from "styled-components";

const template = `
    arrow head
    / 65px auto
`;

export const HeaderComposition: React.FC = () => {
  return (
    <Fragment>
      <Composition template={template}>
        {({ Head, Arrow }: CompositionProps) => (
          <>
            <Arrow>
              <ArrowIcon direction={"l"} size={35} href={"/cabins"}></ArrowIcon>
            </Arrow>
            <Head>
              <Header>Fullføring av booking</Header>
            </Head>
          </>
        )}
      </Composition>
    </Fragment>
  );
};

const Header = styled.h2`
  color: #222;
  font-family: "Playfair Display";
  font-weight: 900;
  font-size: 36px;
  display: inline;
`;
