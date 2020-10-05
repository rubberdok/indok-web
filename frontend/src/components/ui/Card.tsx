import styled from "styled-components";

interface CardProps {
    url: string;
    children: string | JSX.Element;
}

const Card: React.FC<CardProps> = (props) => {
    return <Shadow>{props.children}</Shadow>;
};

export const Shadow = styled.div`
    box-shadow: 0px 97px 73px -44px rgba(0, 0, 0, 0.13);
`;

export default Card;
