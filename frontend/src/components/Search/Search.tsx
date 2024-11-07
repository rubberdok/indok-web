import React, { FC } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: FC = () => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Søk..."
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;

const handleSearchClick = () => {
    console.log("Search button clicked");
  };

  <TextField
    fullWidth
    variant="outlined"
    placeholder="Søk..."
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleSearchClick}>  {/* Legg til onClick */}
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />




