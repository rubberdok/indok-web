import { ChangeEvent } from "react";

const TextField = ({
    title,
    onChange,
    placeholder,
    size,
    value,
}: {
    title: string;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    size?: "short" | "long";
    value?: string;
}) => {
    return (
        <label>
            {title}
            <br />
            {size ? (
                <textarea
                    placeholder={placeholder}
                    rows={size === "short" ? 5 : 10}
                    cols={40}
                    onChange={onChange}
                    style={{ resize: "none" }}
                    value={value}
                />
            ) : (
                <input type="text" placeholder={placeholder} onChange={onChange} value={value} />
            )}
        </label>
    );
};

export default TextField;
