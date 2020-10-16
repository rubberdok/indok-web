import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import Content from "@components/ui/Content";
import { SubTitle, Title } from "@components/ui/Typography";
import { Composition } from "atomic-layout";
import { Fade, Slide } from "react-awesome-reveal";
import styled from "styled-components";

const template = `
  heading
  actions
`;

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
                            <Composition template={template} width={450} widthMd={550} widthLg={700}>
                                {({ Heading, Actions }) => (
                                    <>
                                        <Heading paddingHorizontal={50} paddingTop={30}>
                                            <SubTitle>Foreningen for studentene ved</SubTitle>
                                            <Title>Industriell Økonomi og Teknologiledelse</Title>
                                        </Heading>
                                        <Actions flex align="flex-end" justify="end">
                                            <Button url="/about">Les mer om foreningen</Button>
                                        </Actions>
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
    width: 70vw;
    float: right;
    object-fit: cover;
    filter: drop-shadow(-10px 0px 100px rgba(0, 0, 0, 0.15));
`;

export default Hero;
