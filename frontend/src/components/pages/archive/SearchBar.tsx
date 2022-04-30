import { InputAdornment, OutlinedInput, styled, Toolbar } from "@mui/material";
import { MagnifyingGlass } from "phosphor-react";

interface SearchBarProps {
  searchFilter: string;
  handleSearchFilterChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchFilterCanceled: () => void;
}

const RootStyle = styled(Toolbar)(() => ({
  height: 56,
  display: "flex",
  justifyContent: "space-between",
  padding: 0,
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({
  searchFilter,
  handleSearchFilterChanged,
  handleSearchFilterCanceled,
}) => {
  return (
    <>
      {/* <MuiSearchBar
        value={searchFilter}
        classes={styles}
        onChange={debounce(handleSearchFilterChanged, 200)}
        placeholder={"Søk på dokumenter"}
        onCancelSearch={handleSearchFilterCanceled}
      /> */}
      <RootStyle>
        <SearchStyle
          value={searchFilter}
          onChange={handleSearchFilterChanged}
          placeholder="Søk etter dokumenter..."
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlass />
            </InputAdornment>
          }
        />
      </RootStyle>
    </>
  );
};

export default SearchBar;
