const Choice = ({ title, radio, options }: { title: string; radio?: boolean; options: string[] }) => (
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
