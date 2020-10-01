const Dropdown = ({ title, options }:{ title:string, options:string[] }) => (
    <label>
        {title}
        <select>
            {options.map((option:string) => {
                return(
                    <option value={option}>{option}</option>
                )
            })}
        </select>
    </label>
);

export default Dropdown;