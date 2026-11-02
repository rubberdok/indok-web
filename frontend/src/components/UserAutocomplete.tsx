import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export type UserOption = { id: string; displayName: string; detail?: string | null };

const SEARCH_DELAY_MS = 300;

type Props = {
  label: string;
  value: UserOption | null;
  options: readonly UserOption[];
  loading: boolean;
  onSearch: (query: string) => void;
  onChange: (user: UserOption | null) => void;
  minLength?: number;
  disabled?: boolean;
  helperText?: string;
  placeholder?: string;
};

export const UserAutocomplete: React.FC<Props> = ({
  label,
  value,
  options,
  loading,
  onSearch,
  onChange,
  minLength = 2,
  disabled = false,
  helperText,
  placeholder,
}) => {
  const [input, setInput] = useState("");

  const query = input.trim();
  useEffect(() => {
    if (query.length < minLength || query === value?.displayName) return;
    const timer = setTimeout(() => onSearch(query), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [minLength, onSearch, query, value?.displayName]);

  const shown = value && !options.some((user) => user.id === value.id) ? [value, ...options] : [...options];

  return (
    <Autocomplete<UserOption>
      disabled={disabled}
      value={value}
      options={shown}
      filterOptions={(all) => all}
      getOptionLabel={(option) => option.displayName}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onChange={(_event, user) => onChange(user)}
      onInputChange={(_event, text) => setInput(text)}
      loading={loading}
      noOptionsText={query.length < minLength ? "Skriv for å søke" : "Ingen bruker funnet"}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.displayName}
            {option.detail ? (
              <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                {option.detail}
              </Typography>
            ) : null}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
