import List from "@components/ui/list";
import ListItem from "@components/ui/listItem";

const Choice: React.FC<{
  title: string;
  radio?: boolean;
  options: string[];
}> = ({ title, radio, options }) => (
  <label>
    {title}
    <form>
      <ul>
      {options.map((option: string, index: number) => {
        return (
          <li>
          <label key={index}>
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
