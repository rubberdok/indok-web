import React from "react";
import styled from "styled-components";

const Footer: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>IndøkNTNU.no</h2>
          <p> Hjemmesiden for studentfrivilligheten ved Industriell Økonomi og Teknologiledelse, NTNU</p>
          <p>Laget av RubberDøk, Hovedstyret på Indøks webkomité</p>
          <a href="https://github.com/hovedstyret">
            <img
              src="./img/rubberdøkdøk.png"
              alt="rubberdøk-logo"
              style={{ height: "auto", width: "20%", display: "block", marginLeft: "auto", marginRight: "auto" }}
            />
          </a>
        </Col>
        <Col>
          <p>
            <a href="mailto:leder@indokhs.no">
              <img
                src="./img/mail-icon.svg"
                alt="mail-icon"
                style={{
                  height: "24px",
                  width: "24px",
                  display: "inline-block",
                  marginRight: "2%",
                  marginBottom: "-7px",
                }}
              />
            </a>
            leder@indokhs.no
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
        <Col>
          <button>Hall of Fame</button>
        </Col>
      </Row>
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
export default Footer;
