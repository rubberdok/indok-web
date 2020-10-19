import Layout from "atomic-layout";
import React, { useState } from "react";
import styled from "styled-components";
import Brand from "./Brand";
import NavbarLinks from "./NavbarLinks";

interface NavBoxProps {
    open?: boolean;
}

interface HamburgerProps {
    open?: boolean;
}

const Navbar: React.FC = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <Nav>
            <Brand />
            <Toggle onClick={() => setNavbarOpen(!navbarOpen)}>
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
};

const Nav = styled.nav`
    height: 100px;
    display: flex;
    position: relative;
    justify-content: space-between;
    margin: 0 auto;
    padding: 0 2vw;
    z-index: 2;
    align-self: center;

    @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
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

    @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
        display: flex;
    }
`;

const Navbox = styled.div<NavBoxProps>`
    display: flex;
    height: 100px;
    justify-content: flex-end;
    align-items: center;
    overflow: hidden;

    @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
        flex-direction: column;
        position: fixed;
        width: 100%;
        height: 100vh;
        justify-content: flex-start;
        padding-top: 10vh;
        background-color: #fff;
        transition: all 0.3s ease;
        z-index: 7;
        right: 0;
        width: ${(props) => (props.open ? "0" : "100%")};
    }
`;

const Hamburger = styled.div<HamburgerProps>`
    background-color: #111;
    height: 3px;
    width: 30px;
    transition: all 0.3s ease;
    align-self: center;
    position: relative;
    transform: ${(props) => (props.open ? "rotate(-225deg) scale(0.8)" : "inherit")};
    z-index: 10;

    ::before,
    ::after {
        width: 30px;
        height: 3px;
        background-color: #111;
        content: "";
        position: absolute;
        transition: all 0.3s ease;
    }

    ::before {
        transform: ${(props) => (props.open ? "rotate(90deg) translate(7px,0)" : "rotate(180deg)")};
        top: -7px;
    }

    ::after {
        transform: ${(props) => (props.open ? "rotate(90deg) translate(-7px,0)" : "rotate(180deg)")};
        top: 7px;
    }
`;

export default Navbar;
