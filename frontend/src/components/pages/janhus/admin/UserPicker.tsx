import { useLazyQuery } from "@apollo/client/react";
import { useCallback } from "react";

import { UserAutocomplete } from "@/components/UserAutocomplete";
import { JanHusUserSearchDocument } from "@/generated/graphql";

export type PickedUser = { id: string; displayName: string };

type Props = {
  label: string;
  value: PickedUser | null;
  onChange: (user: PickedUser | null) => void;
  disabled?: boolean;
  helperText?: string;
};

/** Finds a website user by name, email or phone (JanHus admins only), for linking to a booking. */
export const UserPicker: React.FC<Props> = ({ label, value, onChange, disabled = false, helperText }) => {
  const [search, { data, loading }] = useLazyQuery(JanHusUserSearchDocument, { fetchPolicy: "network-only" });

  const onSearch = useCallback(
    (query: string) => {
      search({ variables: { query, limit: 10 } }).catch(() => undefined);
    },
    [search]
  );

  return (
    <UserAutocomplete
      label={label}
      value={value}
      options={(data?.janhusUserSearch ?? []).map((user) => ({
        id: user.id,
        displayName: user.displayName,
        detail: user.email,
      }))}
      loading={loading}
      onSearch={onSearch}
      onChange={(user) => onChange(user ? { id: user.id, displayName: user.displayName } : null)}
      disabled={disabled}
      helperText={helperText}
    />
  );
};
