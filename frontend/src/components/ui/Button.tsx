import feather from "feather-icons";
import Link from "next/link";
import styled from "styled-components";

interface ButtonProps {
    url: string;
    children: string | JSX.Element;
    style?: any;
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <Link href={props.url}>
            <StyledButton as={props.style}>
                <Container>{props.children}</Container>
                <Icon>
                    <i dangerouslySetInnerHTML={{ __html: feather.icons["arrow-right"].toSvg() }} />
                </Icon>
            </StyledButton>
        </Link>
    );
};

const Icon = styled.div`
    background: #111;
    width: 70px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    transition: 0.3s all ease;
    color: #fff;

    & svg {
        margin-top: 8px;
    }
`;

const StyledButton = styled.a`
    background: #282828;
    color: #fff;
    font-family: "Montserrat";
    font-size: 18px;
    border: none;
    display: table;
    text-decoration: none !important;
    transition: 0.3s all ease;

    &:hover {
        background: #111;
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

export const Primary = styled(StyledButton)`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;

    &:hover {
        background: ${({ theme }) => theme.colors.primaryDark};
    }

    & ${Icon} {
        background: ${({ theme }) => theme.colors.primaryDark};
    }
`

export default Button;
