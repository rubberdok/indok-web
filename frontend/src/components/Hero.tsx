import { CompositionProps } from "@atomic-layout/core";
import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import Content from "@components/ui/Content";
import { SubTitle, Title } from "@components/ui/Typography";
import { Composition } from "atomic-layout";
import { Fade, Slide } from "react-awesome-reveal";
import styled from "styled-components";

const areasMobile = `
    heading
    action
`;

const Hero: React.FC = () => (
  <Section>
    <Fade triggerOnce>
      <BackdropImage src="./nth.png" />
      <Image src="/img/hero.jpg" />
    </Fade>
    <Slide direction="left" triggerOnce>
      <Overlay>
        <Content>
          <Card>
            <Composition areas={areasMobile} maxWidth={450} maxWidthMd={550} maxWidthLg={700}>
              {({ Areas }: CompositionProps) => (
                <>
                  <Areas.Heading paddingHorizontal={70} paddingTop={30}>
                    <SubTitle>Foreningen for studentene ved</SubTitle>
                    <Title>Industriell Økonomi og Teknologiledelse</Title>
                  </Areas.Heading>
                  <Areas.Action flex align="flex-end" justify="end">
                    <Button style="primary" link="/about">
                      Les mer om foreningen
                    </Button>
                  </Areas.Action>
                </>
              )}
            </Composition>
          </Card>
        </Content>
      </Overlay>
    </Slide>
  </Section>
);

const Section = styled.div`
  height: calc(100vh - 100px);
  width: 100%;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  height: calc(100vh - 100px);
  width: calc(50% + 312px);
  max-width: 100%;
  float: right;
  object-fit: cover;
  filter: drop-shadow(-10px 0px 100px rgba(0, 0, 0, 0.15));
`;

const BackdropImage = styled.img`
  position: absolute;
  top: -20vw;
  left: -8vw;
  width: 35vw;
  opacity: 0.05;
`;

export default Hero;
