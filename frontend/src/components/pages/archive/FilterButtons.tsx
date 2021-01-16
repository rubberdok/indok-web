import { Wrapper } from "./wrapper";
import { FilterButtonLayout } from "./filterButtonLayout";

interface FilterButtonProps {
    typeFilters: { [key: string]: { active: boolean; title: string } };
    updateTypeFilters: (key: string) => void;
}

const FilterButton = ({ typeFilters, updateTypeFilters }: FilterButtonProps) => {
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
