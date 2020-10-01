import React, { useState } from "react";
import styled from "styled-components";
import NavbarLinks from "./NavbarLinks.tsx";
import Brand from "./Brand.tsx";

const Nav = styled.nav`
    height: 100px;
    display: flex;
    position: relative;
    justify-content: space-between;
    margin: 0 auto;
    padding: 0 2vw;
    z-index: 2;
    align-self: center;

    @media (max-width: 768px) {
        position: sticky;
        height: 8vh;
        top: 0;
        left: 0;
        right: 0;
        left: 0;
    }
`;

const Toggle = styled.div`
    display: none;
    height: 100%;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex;
    }
`;

const Navbox = styled.div`
    display: flex;
    height: 100%;
    justify-content: flex-end;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        position: fixed;
        width: 100%;
        justify-content: flex-start;
        padding-top: 10vh;
        background-color: #fff;
        transition: all 0.3s ease;
        z-index: -1;
        right: ${(props) => (props.open ? "-100%" : "0")};
    }
`;

const Hamburger = styled.div`
    background-color: #111;
    height: 3px;
    width: 30px;
    transition: all 0.3s cubic-bezier(0.54, -0.1, 0.29, 1.24);
    align-self: center;
    position: relative;
    transform: ${(props) => (props.open ? "rotate(-225deg) scale(0.8)" : "inherit")};

    ::before,
    ::after {
        width: 30px;
        height: 3px;
        background-color: #111;
        content: "";
        position: absolute;
        transition: all 0.3s cubic-bezier(0.54, -0.1, 0.29, 1.24);
    }

    ::before {
        transform: ${(props) => (props.open ? "rotate(90deg) translate(7px,0)" : "inherit")};
        top: -7px;
    }

    ::after {
        transform: ${(props) => (props.open ? "rotate(90deg) translate(-7px,0)" : "inherit")};
        top: 7px;
    }
`;
function Navbar(props: any) {
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <Nav>
            <Brand></Brand>
            <Toggle navbarOpen={navbarOpen} onClick={() => setNavbarOpen(!navbarOpen)}>
                {navbarOpen ? <Hamburger open /> : <Hamburger />}
            </Toggle>
            {navbarOpen ? (
                <Navbox>
                    <NavbarLinks />
                </Navbox>
            ) : (
                <Navbox open>
                    <NavbarLinks />
                </Navbox>
            )}
        </Nav>
    );
}

export default Navbar;
