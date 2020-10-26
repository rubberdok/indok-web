import { useState } from "react";
import { Title, SubTitle, Heading, SubHeading, Paragraph } from "@components/ui/Typography";

const Button = () => {
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [active4, setActive4] = useState(false);
    const [active5, setActive5] = useState(false);
    const [active6, setActive6] = useState(false);

    return (
        <div style={{ flex: "100%" }}>
            <br />
            <div style={{ alignContent: "space-between" }}>
                <button
                    style={{
                        background: active1 ? "#065A5A" : "transparent",
                        borderRadius: "60%",
                        padding: "12px",
                    }}
                    onClick={() => setActive1(!active1)}
                ></button>
                <Paragraph>Budsjetter og vedtekter</Paragraph>
            </div>
            <button
                style={{
                    background: active2 ? "#065A5A" : "transparent",
                    margin: "0.5%",
                    borderRadius: "60%",
                    padding: "12px",
                }}
                onClick={() => setActive2(!active2)}
            ></button>
            <Paragraph>Vedtekter og statutter</Paragraph>
            <button
                style={{
                    background: active3 ? "#065A5A" : "transparent",
                    margin: "0.5%",
                    borderRadius: "60%",
                    padding: "12px",
                }}
                onClick={() => setActive3(!active3)}
            ></button>
            <Paragraph>Årbøker</Paragraph>
            <button
                style={{
                    background: active4 ? "#065A5A" : "transparent",
                    margin: "0.5%",
                    borderRadius: "60%",
                    padding: "12px",
                }}
                onClick={() => setActive4(!active4)}
            ></button>
            <Paragraph>Retningslinjer</Paragraph>
            <button
                style={{
                    background: active5 ? "#065A5A" : "transparent",
                    margin: "0.5%",
                    borderRadius: "60%",
                    padding: "12px",
                }}
                onClick={() => setActive5(!active5)}
            ></button>
            <Paragraph>Referater</Paragraph>
            <button
                style={{
                    background: active6 ? "#065A5A" : "transparent",
                    margin: "0.5%",
                    borderRadius: "60%",
                    padding: "12px",
                }}
                onClick={() => setActive6(!active6)}
            ></button>
            <Paragraph>Annet</Paragraph>
        </div>
    );
};

export default Button;
