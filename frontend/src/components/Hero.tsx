import { Shadow } from "./ui/Card.tsx";
import { Title, SubTitle, Heading, SubHeading, Paragraph } from "./ui/Typography";
import Button, { StyledButton } from "./ui/Button.tsx";
import styled from "styled-components";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";

const Hero: React.FC = () => {
    return (
        <Section>
            <Fade>
                <Image src="/img/hero.jpg" />
            </Fade>
            <Slide left>
                <Overlay>
                    <TitleCard>
                        <SubTitle>Foreningen for studentene ved</SubTitle>
                        <Title>Industriell Økonomi og Teknologiledelse</Title>
                        <Button url="#">Les mer om foreningen</Button>
                    </TitleCard>
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
`;

const Image = styled.img`
    height: calc(100vh - 100px);
    width: 70vw;
    float: right;
    object-fit: cover;
    filter: drop-shadow(-10px 0px 100px rgba(0, 0, 0, 0.15));
`;

const TitleCard = styled(Shadow)`
    background: #fff;
    width: 710px;
    padding: 50px 80px 0 90px;
    margin-left: 8vw;
    margin-top: -40px;

    & ${StyledButton} {
        float: right;
        margin-right: -80px;
    }
`;

export default Hero;
