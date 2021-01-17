import { CompositionProps } from "@atomic-layout/core";
import { ArrowIcon } from "@components/ui/ArrowIcon";
import { Composition } from "atomic-layout";
import React from "react";
import styled from "styled-components";

const template = `
    arrow head
`;

interface HeaderCompositionProps {
  headerText: string;
  children: JSX.Element;
}

export const HeaderComposition: React.FC<HeaderCompositionProps> = (props) => {
  return (
    <Container>
      <Composition template={template}>
        {({ Head, Arrow }: CompositionProps) => (
          <>
            <Arrow>{props.children}</Arrow>
            <Head>
              <Header>{props.headerText}</Header>
            </Head>
          </>
        )}
      </Composition>
    </Container>
  );
};

const Header = styled.h2`
  color: #222;
  font-size: 36px;
  display: inline;
  margin-right: 45px;
`;

const Container = styled.div`
  margin: 40px 0 40px 0;
`;

//no_font-family: "Playfair Display";
