import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "./ui/Button";
import { Mail } from "react-feather";

const Footer: React.FC = () => {
  const [openHallOfFame, setOpenHallOfFame] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current && openHallOfFame) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [openHallOfFame]);

  return (
    <Container>
      <Row>
        <Col>
          <h2>IndøkNTNU.no</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Hjemmesiden for studentfrivilligheten ved Industriell Økonomi og Teknologiledelse, NTNU
            <br />
            Laget av RubberDøk, Hovedstyret på Indøks webkomité
          </p>
          <a href="https://github.com/hovedstyret">
            <img
              src="./img/rubberdøkdøk.png"
              alt="rubberdøk-logo"
              style={{
                height: "auto",
                width: "20%",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "2%",
              }}
            />
          </a>
        </Col>
        <Col>
          <p style={{ marginTop: "-5%" }}>
            <MailLink href="mailto:leder@indokhs.no">
              <Mail style={{ marginTop: "2px", marginBottom: "-4px" }} />
              <span style={{ marginLeft: "5px" }}>leder@indokhs.no</span>
            </MailLink>
            <br />
            Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse <br />
            Kolbjørn Hejes vei 1E, NTNU Gløshaugen
            <br />
            7034 Trondheim <br />
            Org. nr. 994 778 463
          </p>
          <div style={{ marginTop: "2%" }}>
            <a href="https://www.facebook.com/HovedstyretIndok/">
              <img
                src="./img/f_logo_RGB-Blue_250.png"
                alt="facebook-icon"
                style={{ height: "24px", width: "24px", display: "inline-block" }}
              />
            </a>
            <a href="https://github.com/hovedstyret">
              <img
                src="./img/GitHub-Mark-Light-120px-plus.png"
                alt="GitHub-icon"
                style={{ height: "24px", width: "24px", marginLeft: "2%", display: "inline-block" }}
              />
            </a>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>Kopirett © 2020 Foreningen for studentene ved Indøk. Alle rettigheter reservert.</Col>
      </Row>
      <Row>
        <Col>
          <div style={{ display: "inline-block", marginBottom: "2%", marginTop: "1em" }}>
            <Button
              styling="secondary"
              onClick={() => {
                setOpenHallOfFame(!openHallOfFame);
              }}
              arrow={false}
            >
              Hall of Fame
            </Button>
          </div>
        </Col>
      </Row>
      {openHallOfFame && (
        <>
          <Row>
            <Col>
              <strong>2020/2021</strong>
            </Col>
          </Row>
          <Row>
            <Col>Laget med blod, svette, tårer og kjærlighet av</Col>
          </Row>
          <Row>
            <Col>
              Morgan Heggland &apos;22
              <br />
              Ingrid Aaseng &apos;22
              <br />
              Fredrik Ahlborg &apos;22
              <br />
              Herman Holmøy &apos;25
              <br />
              Patrik Kjærran &apos;22
              <br />
              Anna Sofie Lunde &apos;22
              <br />
            </Col>
            <Col>
              Hermann Mørkrid &apos;23
              <br />
              Mathias Raa &apos;25
              <br />
              Mathilde Marie Solberg &apos;23 <br />
              Sverre Spetalen &apos;21
              <br />
              Lars Waage &apos;23
              <br />
              Lars Lien Ankile &apos;22
              <br />
              Andreas Johannesen &apos;22
            </Col>
          </Row>
        </>
      )}
      <div ref={bottomRef} />
    </Container>
  );
};

const Container = styled.footer`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  width: 100%;
  margin-top: 7%;
  color: ${({ theme }) => theme.colors.background};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  width: 100%;
`;

const Col = styled.div`
  flex: 1;
  flex-direction: column;
  text-align: center;
  align-items: center;
  width: 100%;
`;

const MailLink = styled.a`
  color: white;
  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;
