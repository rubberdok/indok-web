import List from "@components/ui/list";
import ListItem from "@components/ui/listItem";

const Choice: React.FC<{
  title: string;
  radio?: boolean;
  options: string[];
  key?: string;
}> = ({ title, radio, options, key }) => (
  <label key={key}>
    {title}
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
  </label>
);

export default Choice;
