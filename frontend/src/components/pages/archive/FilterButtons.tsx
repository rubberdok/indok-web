import { FilterButtonLayout } from "./filterButtonLayout";
import { Wrapper } from "./wrapper";

interface FilterButtonProps {
  typeFilters: { [key: string]: { active: boolean; title: string } };
  updateTypeFilters: (key: string) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ typeFilters, updateTypeFilters }) => {
  return (
    <Wrapper>
      {Object.entries(typeFilters).map(([key, val]) => (
        <FilterButtonLayout
          key={key}
          active={val.active}
          title={val.title}
          onClick={() => updateTypeFilters(key)}
        ></FilterButtonLayout>
      ))}
    </Wrapper>
  );
};

export default FilterButton;
