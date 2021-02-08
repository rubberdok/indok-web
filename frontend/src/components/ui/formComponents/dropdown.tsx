import { ChangeEvent } from "react";

const Dropdown: React.FC<{
  options: string[];
  title?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}> = ({ title, options, onChange }) => (
  <>
    {title && <label>{title}</label>}
    <select onBlur={onChange}>
      {options.map((option: string, index: number) => {
        return (
          <option value={option} key={index}>
            {option}
          </option>
        );
      })}
    </select>
  </>
);

export default Dropdown;
