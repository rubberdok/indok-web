import styled from "styled-components";
import Link from "next/link";

const ListItem: React.FC<{
  mainText: string;
  subText: string;
  selected: boolean;
  key?: string;
  imgSrc?: string;
  onClick?: () => void;
}> = ({ mainText, subText, selected, key, imgSrc, onClick }) => {
  const listItem = (
    <Item selected={selected} key={key}>
      <div>{mainText}</div>
      <div>{subText}</div>
      {imgSrc && <img src={imgSrc} alt="" />}
    </Item>
  );
  return onClick ? (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {listItem}
    </button>
  ) : (
    listItem
  );
};

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
