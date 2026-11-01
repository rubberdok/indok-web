import { useLazyQuery } from "@apollo/client/react";
import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { JanHusUserSearchDocument } from "@/generated/graphql";

export type PickedUser = { id: string; displayName: string };

type Option = PickedUser & { email?: string };

const SEARCH_MIN_LENGTH = 2;
const SEARCH_DELAY_MS = 300;

type Props = {
  label: string;
  value: PickedUser | null;
  onChange: (user: PickedUser | null) => void;
  disabled?: boolean;
  helperText?: string;
};

/** Finds a website user by name, email or phone (JanHus admins only), for linking to a booking. */
export const UserPicker: React.FC<Props> = ({ label, value, onChange, disabled = false, helperText }) => {
  const [input, setInput] = useState("");
  const [search, { data, loading }] = useLazyQuery(JanHusUserSearchDocument, { fetchPolicy: "network-only" });

  const query = input.trim();
  useEffect(() => {
    if (query.length < SEARCH_MIN_LENGTH || query === value?.displayName) return;
    const timer = setTimeout(() => search({ variables: { query, limit: 10 } }), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, search, value?.displayName]);

  const found: Option[] = (data?.janhusUserSearch ?? []).map((user) => ({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
  }));
  const options = value && !found.some((user) => user.id === value.id) ? [value, ...found] : found;

  return (
    <Autocomplete<Option>
      disabled={disabled}
      value={value}
      options={options}
      filterOptions={(all) => all}
      getOptionLabel={(option) => option.displayName}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onChange={(_event, user) => onChange(user ? { id: user.id, displayName: user.displayName } : null)}
      onInputChange={(_event, text) => setInput(text)}
      loading={loading}
      noOptionsText={query.length < SEARCH_MIN_LENGTH ? "Skriv minst to tegn" : "Ingen bruker funnet"}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.displayName}
            {option.email ? (
              <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                {option.email}
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
