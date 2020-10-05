import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

interface NavItemProps {
    primary?: boolean;
}

const NavbarLinks: React.FC = () => {
    const router = useRouter();

    return (
        <>
            <Link href="/">
                <NavItem className={router.pathname == "/" ? "active" : ""}>Hjem</NavItem>
            </Link>
            <Link href="/about">
                <NavItem className={router.pathname == "/about" ? "active" : ""}>Om foreningen</NavItem>
            </Link>
            <Link href="/events">
                <NavItem className={router.pathname == "/events" ? "active" : ""}>Arrangementer</NavItem>
            </Link>
            <Link href="/cabins">
                <NavItem className={router.pathname == "/cabins" ? "active" : ""}>Hyttebooking</NavItem>
            </Link>
            <Line />
            <NavItem primary>Login</NavItem>
        </>
    );
};

const NavItem = styled.a<NavItemProps>`
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    color: ${(props) => (props.primary ? ({ theme }) => theme.colors.primary : "#111")};
    display: inline-block;
    white-space: nowrap;
    margin: 0 25px;
    transition: all 200ms ease-in;
    position: relative;

    :after,
    &.active:after {
        @media (min-width: 768px) {
            position: absolute;
            bottom: -9px;
            left: 0;
            right: 0;
            width: 0%;
            margin: 0 auto;
            content: ".";
            color: transparent;
            background: ${(props) => (props.primary ? ({ theme }) => theme.colors.primary : "#111")};
            height: 2px;
            transition: all 0.2s ease;
        }
    }

    &.active:after {
        width: 100%;
    }

    :hover {
        text-decoration: none;
        cursor: pointer;

        ::after {
            width: 100%;
        }
    }

    @media (max-width: 768px) {
        padding: 20px 0;
        font-size: 1.5rem;
        z-index: 99999;
    }
`;

const Line = styled.div`
    background: ${({ theme }) => theme.colors.primary};
    margin: 0 25px;
    width: 20px;
    height: 2px;
    @media (max-width: 768px) {
        display: none;
    }
`;

export default NavbarLinks;
