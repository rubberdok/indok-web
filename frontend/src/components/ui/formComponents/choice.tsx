const Choice: React.FC<{
  options: string[];
  name: string;
  title?: string;
  radio?: boolean;
  disabled?: boolean;
}> = ({ options, name, title, radio, disabled }) => (
  <>
    {title && <label>{title}</label>}
    <form>
      <ul>
        {options.map((option: string, index: number) => {
          return (
            <li key={index}>
              <label>
                <input type={radio ? "radio" : "checkbox"} disabled={disabled} name={name} />
                {option}
              </label>
            </li>
          );
        })}
      </ul>
    </form>
  </>
);

export default Choice;
