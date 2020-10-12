const Choice: React.FC<{
    title: string;
    radio?: boolean;
    options: string[];
}> = ({ title, radio, options }) => (
    <label>
        {title}
        <form>
            {options.map((option: string, index: number) => {
                return (
                    <label key={index}>
                        <input type={radio ? "radio" : "checkbox"} />
                        {option}
                    </label>
                );
            })}
        </form>
    </label>
);

export default Choice;
