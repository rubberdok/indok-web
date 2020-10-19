import Button, { Primary } from "@components/ui/Button";
import Card from "@components/ui/Card";
import Content from "@components/ui/Content";
import { SubTitle, Title } from "@components/ui/Typography";
import { Composition } from "atomic-layout";
import { Fade, Slide } from "react-awesome-reveal";
import styled from "styled-components";

const areasMobile = `
  heading
  action
`

const Hero: React.FC = () => {
    return (
        <Section>
            <Fade triggerOnce>
                <Image src="/img/hero.jpg" />
            </Fade>
            <Slide direction="left" triggerOnce>
                <Overlay>
                    <Content>
                        <Card>
                            <Composition areas={areasMobile} maxWidth={450} maxWidthMd={550} maxWidthLg={700}>
                                {( Areas ) => (
                                    <>
                                        <Areas.Heading paddingHorizontal={70} paddingTop={30}>
                                            <SubTitle>Foreningen for studentene ved</SubTitle>
                                            <Title>Industriell Økonomi og Teknologiledelse</Title>
                                        </Areas.Heading>
                                        <Areas.Action flex align="flex-end" justify="end">
                                            <Button style={Primary} url="/about">Les mer om foreningen</Button>
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
};

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
    width: calc(50vw + 300px);
    float: right;
    object-fit: cover;
    filter: drop-shadow(-10px 0px 100px rgba(0, 0, 0, 0.15));
`;

export default Hero;
