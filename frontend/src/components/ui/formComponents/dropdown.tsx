import { ChangeEvent } from "react";

const Dropdown: React.FC<{
  options: { text: string; value: string; selected?: boolean }[];
  title?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}> = ({ title, options, onChange }) => (
  <>
    {title && <label>{title}</label>}
    <select onBlur={onChange}>
      {options.map((option, index) => {
        return (
          <option value={option.value} selected={option.selected} key={index}>
            {option.text}
          </option>
        );
      })}
    </select>
  </>
);

export default Dropdown;
