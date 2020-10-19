import { useQuery } from "@apollo/client";
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */

import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { GET_ARCHIVEDDOCUMENTS, GET_FILELOCATION } from "../graphql/archive/queries";

const Button = styled.button`
    background: ${(props) => (props.active ? "#065A5A" : "transparent")};
    font-size: 0.7em;
    margin-top: 5em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid ${(props) => (props.active ? "white" : "#065A5A")};
    border-radius: 3px;
    id: string;
`;

const ButtonTitle = styled.h1`
    font-size: 1.5em;
    text-align: center;
    font-family: montserrat;
    font-weight: normal;
    focused: "red";
    color: ${(props) => (props.active ? "white" : "#065A5A")};
`;

const Input = styled.input.attrs((props) => ({
    size: props.size || "1em",
}))`
    color: "#065A5A";
    background: transparent;
    border-radius: 3px;
    font-size: 1em;
    text-align: center;
    font-family: montserrat;
    font-weight: normal;
    color: ${(props) => (props.active ? "white" : "#065A5A")}
    border: 2px solid color: ${(props) => (props.active ? "white" : "#065A5A")}
  
    margin: ${(props) => props.size};
    padding: ${(props) => props.size};
  `;
/* 
  class AllocateDocuments extends React.Component {
      i = GET_ARCHIVEDDOCUMENTS.size();
      for (let i = 0; i< GET_ARCHIVEDDOCUMENTS.keys().length() i++)  {

        for (let i = 0; i < 3; i++) {

      }
  }
 */

const getThumbNailSource = () => {
    const { id, fileLocation } = useQuery(GET_FILELOCATION);

    return data.allArchives.map((document: Archive) => (
        <div key={document.id}>
            <p>
                {document.id}: {document.filelocation}
            </p>
        </div>
    ));
};

class FetchThumbnails extends React.Component {
    render() {
        return (
            <div>
                <img
                    src={this.getThumbNailSource()}
                    style={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        transform: "scale(-50%, -50%)",
                    }}
                    alt="docu"
                />
                <img
                    src="https://drive.google.com/thumbnail?id=1ReOTT8xJVh5NTDdYI8ZF8NYHS9L1Er_uUXFZ7zicayI"
                    style={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        transform: "scale(-50%, -50%)",
                    }}
                    alt="docu"
                />
            </div>
        );
    }
    getThumbNailSource(): string | undefined {
        throw new Error("Method not implemented.");
    }
}

class FilterDocuments extends React.Component {
    state = {
        active: true,
    };

    // buttons= document.getElementsByTagName("Button");

    changeColor = () => {
        if (this.state.active == false) {
            this.setState({ active: true });
        } else {
            this.setState({ active: false });
        }
    };

    getImageSource() {
        return `https://drive.google.com/thumbnail?id=${GET_DOCUMENTID}`;
    }

    handlePageChange() {
        window.location.hash = `https://docs.google.com/document/d/${GET_DOCUMENTID}/`;
    }

    render() {
        return (
            <div>
                <Link href="/"> Go Home </Link>
                <br />
                <h1>Filtrer dokumenter</h1>
                <Button id="b1" active={this.state.active} onClick={() => this.changeColor()}>
                    <ButtonTitle active={this.state.active}>Budsjetter og regnskap</ButtonTitle>
                </Button>
                <Button id="b2" active={this.state.active} onClick={() => this.changeColor()}>
                    <ButtonTitle active={this.state.active}>Vedtekter og statuetter</ButtonTitle>
                </Button>
                <Button id="b3" active={this.state.active} onClick={() => this.changeColor()}>
                    <ButtonTitle active={this.state.active}>Årbøker</ButtonTitle>
                </Button>
                <Button id="b4" active={this.state.active} onClick={() => this.changeColor()}>
                    <ButtonTitle active={this.state.active}>Retningslinjer</ButtonTitle>
                </Button>
                <Button id="b5" active={this.state.active} onClick={() => this.changeColor()}>
                    <ButtonTitle active={this.state.active}>Referater</ButtonTitle>
                </Button>
                <Button id="b6" active={this.state.active} onClick={() => this.changeColor()}>
                    <ButtonTitle active={this.state.active}>Annet</ButtonTitle>
                </Button>
                <div>
                    <Input active placeholder="Søk etter dokumenter" color="#065A5A" size="1em" />
                    <Button active color="#065A5A" size="1em">
                        Søk
                    </Button>
                    <br />
                </div>
            </div>
        );
    }
}

console.log(GET_ARCHIVEDDOCUMENTS);
console.log(GET_FILELOCATION);

const Archive: NextPage = () => (
    <Layout>
        <div>
            <FilterDocuments />
            <h1> Archive</h1>
            <FetchThumbnails />
        </div>
    </Layout>
);

export default Archive;
