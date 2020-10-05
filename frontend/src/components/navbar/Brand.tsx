import React from "react";
import styled from "styled-components";
import Link from "next/link";

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

const Brand = () => {
    return (
        <LogoWrap>
            <Link href="#">
                <Logo src={"/logo.svg"} alt="Company Logo" />
            </Link>
        </LogoWrap>
    );
};

export default Brand;
