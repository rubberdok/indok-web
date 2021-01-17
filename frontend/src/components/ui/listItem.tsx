import styled from "styled-components";

const ListItem: React.FC<{
  mainText: string;
  subText: string;
  key: string;
  selected: boolean;
  imgSrc?: string;
  onClick?: () => void;
}> = ({ mainText, subText, key, selected, imgSrc, onClick }) => (
  <Item selected={selected} key={key}>
    <button
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }}
    >
      <div>{mainText}</div>
      <div>{subText}</div>
      <img src={imgSrc} alt="" />
    </button>
  </Item>
);

const Item = styled.li<{ selected: boolean }>`
    background-color: ${(props) => props.selected && props.theme.colors.primary};
    color: ${(props) => (props.selected ? "white" : "black")};
    padding: 10px;
    border-radius: 8px;
    width: 15em;
    &:hover {
        background-color: ${(props) => !props.selected && props.theme.colors.primaryLight};
    }
    border-top: ${(props) => (props.selected ? "0px" : "1px solid #ddd")};
    &:first-child {
        border-top: 0px;
    )
`;

export default ListItem;
