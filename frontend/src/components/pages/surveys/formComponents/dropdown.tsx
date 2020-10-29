const Dropdown: React.FC<{
    title: string;
    options: string[];
}> = ({ title, options }) => (
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
