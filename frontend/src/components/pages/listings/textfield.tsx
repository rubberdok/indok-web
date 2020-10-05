import { ChangeEvent } from "react";

const TextField = ({
    title,
    onChange,
    placeholder,
    size,
}: {
    title: string;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    size?: "short" | "long";
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
                />
            ) : (
                <input type="text" placeholder={placeholder} onChange={onChange} />
            )}
        </label>
    );
};

export default TextField;
