import { makeStyles } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { debounce } from "ts-debounce";

interface SearchBarProps {
  searchFilter: string;
  handleSearchFilterChanged: (name: string) => void;
  handleSearchFilterCanceled: () => void;
}

const useStyles = makeStyles({
  input: {
    fontSize: "14px",
  },
});

const SearchBarComp: React.FC<SearchBarProps> = ({
  searchFilter,
  handleSearchFilterChanged,
  handleSearchFilterCanceled,
}) => {
  const styles = useStyles();
  return (
    <SearchBar
      value={searchFilter}
      classes={styles}
      onChange={debounce(handleSearchFilterChanged, 200)}
      placeholder={"Søk på dokumenter"}
      style={{
        margin: "0 auto",
        maxWidth: 300,
      }}
      onCancelSearch={handleSearchFilterCanceled}
    />
  );
};

export default SearchBarComp;
