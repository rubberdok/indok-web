import React from "react";
import styled from "styled-components";
import Link from "next/link";

interface NavItemProps {
    primary?: boolean;
}

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

    :after {
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
        z-index: 6;
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

interface Site {
    href: string;
    text: string;
}

const sites: Site[] = [
    {
        text: "Hjem",
        href: "/",
    },
    {
        text: "Om foreningen",
        href: "/about",
    },
    {
        text: "Arrangementer",
        href: "/events",
    },
    {
        text: "Hyttebooking",
        href: "/cabins",
    },
];

const NavbarLinks: React.FC = () => {
    return (
        <>
            {sites.map((site) => (
                <Link href={site.href} key={site.href}>
                    <NavItem>{site.text}</NavItem>
                </Link>
            ))}
            <Line />
            <NavItem primary>Login</NavItem>
        </>
    );
};

export default NavbarLinks;
