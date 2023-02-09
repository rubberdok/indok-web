import { Search } from "@mui/icons-material";
import { InputAdornment, OutlinedInput, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

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
  "&.Mui-focused": { boxShadow: theme.shadows[8] },
  "& fieldset": {
    borderWidth: `1px !important`,
  },
}));

type Props = {
  searchFilter: string;
  handleSearchFilterChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchFilterCanceled: () => void;
  placeholder: string;
};

export const SearchBar: React.FC<Props> = ({ searchFilter, handleSearchFilterChanged, placeholder }) => {
  return (
    <RootStyle>
      <SearchStyle
        value={searchFilter}
        onChange={handleSearchFilterChanged}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
};
