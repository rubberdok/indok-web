import styled from "styled-components";

const Input = styled.input`
  background: #065a5a;
  border: 2px solid #065a5a;
  font-family: "Montserrat";
  font-size: 17px;
  padding: 10px;
  text-decoration: none !important;
  background: linear-gradient(to bottom, #065a5a 50%, #f5f0eb 50%) top;
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
    color: #065a5a;
    ::placeholder {
      color: #065a5a;
    }
  }
`;

Input.displayName = "Input";

export default Input;
