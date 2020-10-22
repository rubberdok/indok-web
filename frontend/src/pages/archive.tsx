/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */

import { NextPage } from "next";
import Link from "next/link";
import styled from "styled-components";
import Layout from "../components/Layout";
import React, { Component } from "react";
import AllDocuments from "../components/pages/archive/allDocuments";

const Button = styled.button`
    background: ${(props) => (props.clicked ? "#065A5A" : "transparent")};
    font-size: 0.7em;
    margin-top: 5em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid ${(props) => (props.clicked ? "white" : "#065A5A")};
    border-radius: 3px;
`;

const ButtonTitle = styled.h1`
    font-size: 1.5em;
    text-align: center;
    font-family: montserrat;
    font-weight: normal;
    focused: "red";
    color: ${(props) => (props.clicked ? "white" : "#065A5A")};
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
    color: ${(props) => (props.clicked ? "white" : "#065A5A")}
    border: 2px solid color: ${(props) => (props.clicked ? "white" : "#065A5A")}
  
    margin: ${(props) => props.size};
    padding: ${(props) => props.size};
  `;

class FetchThumbnails extends React.Component {
    render() {
        return (
            <div>
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

class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poetFilter: "",
        };
    }

    handleChange = (e) => {
        this.setState({
            poetFilter: e.target.value,
        });
        this.props.onChange(event.target.value);
    };

    render() {
        return (
            <div>
                <label htmlFor="filter">Søk på tittel: </label>
                <input type="text" id="filter" value={this.state.poetFilter} onChange={this.handleChange} />
            </div>
        );
    }
}

class FilterButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { clicked: false };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState((state) => ({
            clicked: !state.clicked,
        }));
    }

    render() {
        return <button onClick={this.handleClick}>{this.state.clicked ? "hei" : "nei"}</button>;
    }
}

class FilterDocuments extends React.Component {
    state = {
        active: true,
    };

    render() {
        let className = "menu";
        if (this.props.clicked) {
            className += "-clicked";
        }
        return (
            <div>
                <Link href="/"> Go Home </Link>
                <br />
                <h1>Filtrer dokumenter</h1>

                <Button active={this.state.active}>
                    <ButtonTitle active={this.state.active}>Budsjetter og regnskap</ButtonTitle>
                </Button>
                <Button active={this.state.active}>
                    <ButtonTitle active={this.state.active}>Vedtekter og statuetter</ButtonTitle>
                </Button>
                <Button id="b3" active={this.state.active}>
                    <ButtonTitle active={this.state.active}>Årbøker</ButtonTitle>
                </Button>
                <Button id="b4" active={this.state.active}>
                    <ButtonTitle active={this.state.active}>Retningslinjer</ButtonTitle>
                </Button>
                <Button id="b5" active={this.state.active}>
                    <ButtonTitle active={this.state.active}>Referater</ButtonTitle>
                </Button>
                <Button id="b6" active={this.state.active}>
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

const Archive: NextPage = () => (
    <Layout>
        <div>
            <FilterDocuments />
            <FilterButton />
            <FilterForm />
            <h1> Arkiv</h1>
            <FetchThumbnails />
            <AllDocuments />
        </div>
    </Layout>
);

export default Archive;
