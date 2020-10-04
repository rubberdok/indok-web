const TextField = ({
    title,
    placeholder,
    size = "oneline" || "short" || "long",
}: {
    title: string;
    placeholder: string;
    size: string;
}) => {
    let text: string = "";
    return (
        <label>
            {title}
            {size != "oneline" ? <br /> : null}
            <input
                type="text"
                placeholder={placeholder}
                style={{
                    width: "300px",
                    height: size == "short" ? "200px" : size == "long" ? "500px" : "",
                }}
                onChange={(e) => (text = e.target.value)}
            />
        </label>
    );
};

export default TextField;
