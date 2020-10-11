const Dropdown = ({ title, options }: { title: string; options: string[] }) => (
    <label>
        {title}
        <select>
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
