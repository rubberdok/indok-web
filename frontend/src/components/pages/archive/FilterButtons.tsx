import { useState } from "react";
import { Title, SubTitle, Heading, SubHeading, Paragraph } from "@components/ui/Typography";
import { Wrapper, ContentWrapper } from "../archive/wrapper";

const Button = () => {
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [active4, setActive4] = useState(false);
    const [active5, setActive5] = useState(false);
    const [active6, setActive6] = useState(false);

    return (
        <Wrapper>
            <ContentWrapper>
                <button
                    style={{
                        background: active1 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                        marginLeft: "120px",
                    }}
                    onClick={() => setActive1(!active1)}
                ></button>
                <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px" }}>
                    Budsjetter og vedtekter
                </Paragraph>
            </ContentWrapper>
            <ContentWrapper>
                <button
                    style={{
                        background: active2 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                    }}
                    onClick={() => setActive2(!active2)}
                ></button>
                <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px" }}>
                    Vedtekter og statutter
                </Paragraph>
            </ContentWrapper>
            <ContentWrapper>
                <button
                    style={{
                        background: active3 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                    }}
                    onClick={() => setActive3(!active3)}
                ></button>
                <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px" }}>Årbøker</Paragraph>
            </ContentWrapper>
            <ContentWrapper>
                <button
                    style={{
                        background: active4 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                    }}
                    onClick={() => setActive4(!active4)}
                ></button>
                <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px" }}>
                    Retningslinjer
                </Paragraph>
            </ContentWrapper>
            <ContentWrapper>
                <button
                    style={{
                        background: active5 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                    }}
                    onClick={() => setActive5(!active5)}
                ></button>
                <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px" }}>Referater</Paragraph>
            </ContentWrapper>
            <ContentWrapper>
                <button
                    style={{
                        background: active6 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                    }}
                    onClick={() => setActive6(!active6)}
                ></button>
                <Paragraph style={{ fontSize: "14px", padding: "12px", marginBottom: "12px", marginRight: "200px" }}>
                    Annet
                </Paragraph>
            </ContentWrapper>
        </Wrapper>
    );
};

export default Button;
