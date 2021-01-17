import { ChangeEvent } from "react";

const Dropdown: React.FC<{
  title: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}> = ({ title, options, onChange }) => (
  <label>
    {title}
    <select onBlur={onChange}>
      {options.map((option: string, index: number) => {
        return (
          <option value={option} key={index}>
            {option}
          </option>
        );
      })}
    </select>
  </label>
);

export default Dropdown;
