/* eslint-disable prettier/prettier */
import { NextPage } from "next";
import Link from "next/link";
import styled from "styled-components";
import Layout from "../components/Layout";

const Button = styled.button`
    background: ${(props) => (props.primary ? "#065A5A" : "white")};
    color: ${(props) => (props.primary ? "white" : "#065A5A")};

    font-size: 0.7em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid ${(props) => (props.primary ? "white" : "#065A5A")};
    border-radius: 3px;
`;

const ButtonTitle = styled.h1`
    font-size: 1.5em;
    text-align: center;
    font-family: montserrat;
    font-weight: normal;
    color: ${(props) => (props.primary ? "white" : "#065A5A")};
`;

const FilterDocuments = () => {
    return (
        <div>
            <Link href="/"> Go Home </Link>
            <Button primary>
                <ButtonTitle primary>Budsjetter og regnskap</ButtonTitle>
            </Button>
            <Button primary>
                <ButtonTitle primary>Vedtekter og statuetter</ButtonTitle>
            </Button>
            <Button primary>
                <ButtonTitle primary>Årbøker</ButtonTitle>
            </Button>
            <Button primary>
                <ButtonTitle primary>Retningslinjer</ButtonTitle>
            </Button>
            <Button primary>
                <ButtonTitle primary>Referater</ButtonTitle>
            </Button>
            <Button primary>
                <ButtonTitle primary>Annet</ButtonTitle>
            </Button>
        </div>
    );
};

const Archive: NextPage = () => (
    <Layout>
        <div>
            <FilterDocuments />
            <h1> Archive</h1>
        </div>
    </Layout>
);

export default Archive;
