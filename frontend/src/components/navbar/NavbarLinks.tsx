import Layout from "atomic-layout";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const links = [
    {
        id: "1",
        title: "Hjem",
        href: "/",
    },
    {
        id: "2",
        title: "Om foreningen",
        href: "/about",
    },
    {
        id: "3",
        title: "Arrangementer",
        href: "/events",
    },
    {
        id: "4",
        title: "Hyttebooking",
        href: "/cabins",
    }
]

interface NavItemProps {
    primary?: boolean;
}

const NavbarLinks: React.FC = () => {
    const router = useRouter();

    return (
        <>
            {links.map((item) => (
                <Link key={item.id} href={item.href}>
                    <NavItem className={router.pathname == item.href ? "active" : ""}>{item.title}</NavItem>
                </Link>
            ))}
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
    padding: 10px 0;

    :after,
    &.active:after {
        @media (min-width: ${Layout.breakpoints.md.maxWidth}) {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 1px;
            width: 50%;
            margin: 0 auto;
            content: ".";
            color: transparent;
            background: ${(props) => (props.primary ? ({ theme }) => theme.colors.primary : "#111")};
            height: 2px;
            transition: all 0.2s ease;
            opacity: 0;
        }
    }

    &.active:after {
        width: 100%;
        opacity: 1;
    }

    :hover {
        text-decoration: none;
        cursor: pointer;

        ::after {
            width: 100%;
            opacity: 1;
        }
    }

    @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
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
    @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
        display: none;
    }
`;

export default NavbarLinks;
