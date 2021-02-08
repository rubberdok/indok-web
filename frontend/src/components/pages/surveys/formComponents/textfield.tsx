import { ChangeEvent } from "react";

const TextField: React.FC<{
  title?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  size?: "short" | "long";
  value?: string;
  key?: string;
  disabled?: boolean;
}> = ({ title, onChange, placeholder, size, value, key, disabled }) => {
  return (
    <label key={key}>
      {title}
      <br />
      {size ? (
        <textarea
          placeholder={placeholder}
          rows={size === "short" ? 1 : 5}
          cols={40}
          onChange={onChange}
          style={{ resize: "none" }}
          value={value}
          disabled={disabled}
        />
      ) : (
        <input type="text" placeholder={placeholder} disabled={disabled} onChange={onChange} value={value} />
      )}
    </label>
  );
};

export default TextField;
