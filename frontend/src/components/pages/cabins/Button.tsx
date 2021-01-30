import feather from "feather-icons";
import Link from "next/link";
import styled from "styled-components";

interface ButtonProps {
  url: string;
  children: string | JSX.Element;
  onClick?: (event: React.FormEvent<EventTarget>) => void;
  disabled?: boolean;
}

interface IconProps {
  disabled?: boolean;
}

interface StyledButtonProps {
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <Link href={props.url}>
      <StyledButton
        onClick={(event: React.FormEvent<EventTarget>) => (props.onClick ? props.onClick(event) : null)}
        disabled={props.disabled}
      >
        <Container>{props.children}</Container>
        <Icon disabled={props.disabled}>
          <i dangerouslySetInnerHTML={{ __html: feather.icons["arrow-right"].toSvg() }} />
        </Icon>
      </StyledButton>
    </Link>
  );
};

const Icon = styled.div<IconProps & React.HTMLProps<HTMLDivElement>>`
  background: ${({ disabled }) => (disabled ? "#5f5e5e" : "#064B4B")};
  width: 70px;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  transition: 0.3s all ease;
  & svg {
    margin-top: 8px;
  }
`;

const StyledButton = styled.a<StyledButtonProps & React.HTMLProps<HTMLAnchorElement>>`
  background: ${({ disabled }) => (disabled ? "#7a7979" : "#065A5A")};
  color: #fff;
  font-family: "Montserrat";
  font-size: 18px;
  border: none;
  display: table;
  text-decoration: none !important;
  transition: 0.3s all ease;
  &:hover {
    background: ${({ disabled }) => (disabled ? "#5f5e5e" : "#064B4B")};
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
