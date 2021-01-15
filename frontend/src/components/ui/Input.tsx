import styled from "styled-components";

const Input = styled.input`
  background: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  font-family: "Montserrat";
  font-size: 17px;
  padding: 10px;
  text-decoration: none !important;
  background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.primary} 50%,
      ${({ theme }) => theme.colors.background} 50%
    )
    top;
  background-size: 100% 200%;
  transition: all 0.2s ease-in-out;
  color: white;

  ::placeholder {
    color: white;
  }

  &:hover {
  }

  &:focus {
    background-position: 0% -100%;
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
    ::placeholder {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

Input.displayName = "Input";

export default Input;
