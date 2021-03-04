import SearchBar from "material-ui-search-bar";
import { debounce } from "ts-debounce";

interface SearchBarProps {
  searchFilter: string;
  handleSearchFilterChanged: (name: string) => void;
}

const SearchBarComp: React.FC<SearchBarProps> = ({ searchFilter, handleSearchFilterChanged }) => {
  return (
    <SearchBar
      value={searchFilter}
      onChange={debounce(handleSearchFilterChanged, 200)}
      placeholder={"Søk på dokumenter"}
      style={{
        margin: "0 auto",
        maxWidth: 300,
      }}
    />
  );
};

export default SearchBarComp;
