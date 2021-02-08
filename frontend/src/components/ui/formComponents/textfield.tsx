import { ChangeEvent } from "react";

const TextField: React.FC<{
  title?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  size?: "short" | "long";
  value?: string;
  disabled?: boolean;
}> = ({ title, onChange, placeholder, size, value, disabled }) => {
  return (
    <>
      {title && <label>{title}</label>}
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
    </>
  );
};

export default TextField;
