const Choice: React.FC<{
  options: string[];
  title?: string;
  radio?: boolean;
}> = ({ options, title, radio }) => (
  <>
    {title && <label>{title}</label>}
    <form>
      <ul>
        {options.map((option: string, index: number) => {
          return (
            <li key={index}>
              <label>
                <input type={radio ? "radio" : "checkbox"} />
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
