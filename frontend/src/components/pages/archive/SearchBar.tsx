import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

type Props = {
  searchFilter: string;
  handleSearchFilterChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchFilterCanceled: () => void;
};

export const SearchBar: React.FC<Props> = ({ searchFilter, handleSearchFilterChanged }) => {
  return (
    <TextField
      value={searchFilter}
      onChange={handleSearchFilterChanged}
      placeholder="Søk etter dokumenter..."
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};
