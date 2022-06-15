import { InputAdornment, OutlinedInput, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SearchIcon } from "@heroicons/react/outline";

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

const SearchBar: React.FC<SearchBarProps> = ({ searchFilter, handleSearchFilterChanged }) => {
  return (
    <RootStyle>
      <SearchStyle
        value={searchFilter}
        onChange={handleSearchFilterChanged}
        placeholder="Søk etter dokumenter..."
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon width={20} height={20} />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
};

export default SearchBar;
