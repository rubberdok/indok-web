import { FocusEventHandler } from "react";

type SelectItem = {
  name: string;
  value: string | number | undefined;
  selected?: boolean;
};

type Props = {
  name: string;
  items: SelectItem[];
  placeholder?: string;
  onChange: FocusEventHandler<HTMLSelectElement>;
};

export const Select: React.FC<React.PropsWithChildren<Props>> = ({ name, items, placeholder, onChange }) => {
  return (
    <div>
      <h6 style={{ marginBottom: 0, marginTop: 0 }}>{`${name}:`}</h6>
      <select onBlur={onChange} style={{ width: "100%" }}>
        <option disabled selected>
          {placeholder ? placeholder : `Velg ${name.toLowerCase()}`}
        </option>
        {items.map((item) => {
          return (
            <option key={item.value} value={item.value} selected={item?.selected}>
              {item.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
