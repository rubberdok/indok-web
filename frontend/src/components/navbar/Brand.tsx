import Link from "next/link";
import React from "react";
import styled from "styled-components";

const Brand = () => {
    return (
        <LogoWrap>
            <Link href="/">
                <Logo src={"/logo.svg"} alt="INDØK Hovedstyre" />
            </Link>
        </LogoWrap>
    );
};

const LogoWrap = styled.div`
    margin: auto 0;
    z-index: 10;
`;
const Logo = styled.img`
    width: 120px;

    &:hover {
        cursor: pointer;
    }
`;

export default Brand;
