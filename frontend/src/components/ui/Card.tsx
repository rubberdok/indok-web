import styled from "styled-components";

export default function Card(props: any) {
    return <Shadow>{props.children}</Shadow>;
}

export const Shadow = styled.div`
    box-shadow: 0px 97px 73px -44px rgba(0, 0, 0, 0.13);
`;
