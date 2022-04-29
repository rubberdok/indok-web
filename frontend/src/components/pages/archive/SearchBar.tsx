import makeStyles from "@mui/styles/makeStyles";
import { default as MuiSearchBar } from "material-ui-search-bar";
import { debounce } from "ts-debounce";

interface SearchBarProps {
  searchFilter: string;
  handleSearchFilterChanged: (name: string) => void;
  handleSearchFilterCanceled: () => void;
}

const useStyles = makeStyles(() => ({
  input: {
    fontSize: "14px",
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({
  searchFilter,
  handleSearchFilterChanged,
  handleSearchFilterCanceled,
}) => {
  const styles = useStyles();

  return (
    <MuiSearchBar
      value={searchFilter}
      classes={styles}
      onChange={debounce(handleSearchFilterChanged, 200)}
      placeholder={"Søk på dokumenter"}
      onCancelSearch={handleSearchFilterCanceled}
    />
  );
};

export default SearchBar;
