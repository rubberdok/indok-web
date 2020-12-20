import Link from "next/link";
import { ArrowLeft, ArrowRight } from "react-feather";
import styled from "styled-components";

interface ButtonProps {
  link?: string;
  children: string | JSX.Element;
  style?: "primary" | "secondary";
  back?: boolean;
}

interface LinkProps {
  condition: boolean;
  wrapper: { (children: JSX.Element): JSX.Element };
  children: JSX.Element;
}

const WithLink: React.FC<LinkProps> = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

const Button: React.FC<ButtonProps> = (props) => {
  const styles = {
    primary: Primary,
    secondary: Secondary,
  };

  return (
    <WithLink
      condition={!!props.link}
      wrapper={(children: JSX.Element) => <Link href={props.link || "/"}>{children}</Link>}
    >
      <StyledButton back={props.back} as={props.style ? styles[props.style] : undefined}>
        {props.back ? (
          <>
            <Icon>
              <ArrowLeft />
            </Icon>
            <Container>{props.children}</Container>
          </>
        ) : (
          <>
            <Container>{props.children}</Container>
            <Icon>
              <ArrowRight />
            </Icon>
          </>
        )}
      </StyledButton>
    </WithLink>
  );
};

const Icon = styled.div`
  background: #111;
  width: 70px;
  display: flex;
  text-align: center;
  transition: 0.3s all ease;
  color: #fff;
  justify-content: center;
  align-items: center;

  & svg {
    margin-top: 4px;
  }
`;

const StyledButton = styled.button<ButtonProps>`
  background: #282828;
  color: #fff;
  font-family: "Montserrat";
  font-size: 18px;
  border: none;
  display: flex;
  align-items: stretch;
  text-decoration: none !important;
  transition: 0.3s all ease;
  padding: 0;

  &:hover {
    background: #111;
    cursor: pointer;

    & ${Icon} {
      padding: ${(props) => (props.back ? "0 10px 0 0" : "0 0 0 10px")};
      width: 70px;
    }
  }

  &:focus {
    border: none;
    outline: none;
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
`;

export const Secondary = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;

  &:hover {
    background: ${({ theme }) => theme.colors.secondaryDark};
  }

  & ${Icon} {
    background: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

export default Button;
