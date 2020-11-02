import styled from "styled-components";
import Link from "next/link";
import feather from "feather-icons";

interface ButtonProps {
    url: string;
    children: string | JSX.Element;
    onClick?: (event: React.FormEvent<EventTarget>) => void;
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <Link href={props.url}>
            <StyledButton
                onClick={(event: React.FormEvent<EventTarget>) => (props.onClick ? props.onClick(event) : null)}
            >
                <Container>{props.children}</Container>
                <Icon>
                    <i dangerouslySetInnerHTML={{ __html: feather.icons["arrow-right"].toSvg() }} />
                </Icon>
            </StyledButton>
        </Link>
    );
};

const Icon = styled.div`
    background: ${({ theme }) => theme.colors.primaryDark};
    width: 70px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    transition: 0.3s all ease;
    & svg {
        margin-top: 8px;
    }
`;

const StyledButton = styled.a`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-family: "Montserrat";
    font-size: 18px;
    border: none;
    display: table;
    text-decoration: none !important;
    transition: 0.3s all ease;
    &:hover {
        background: ${({ theme }) => theme.colors.primaryDark};
        cursor: pointer;
        & ${Icon} {
            padding-left: 10px;
            width: 70px;
        }
    }
`;

const Container = styled.div`
    padding: 20px 35px;
`;

export default Button;
