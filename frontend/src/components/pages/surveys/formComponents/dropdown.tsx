import { ChangeEvent } from "react";

const Dropdown: React.FC<{
  title: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  key?: string;
}> = ({ title, options, onChange, key }) => (
  <label key={key}>
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
