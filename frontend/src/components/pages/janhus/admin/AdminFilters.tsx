import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import { JANHUS_EVENT_TYPE_LABELS, OwnerType, SortBy, SortDirection } from "@/components/pages/janhus/constants";

type AreaOption = { id: string; name: string };

type Props = {
  areas: readonly AreaOption[];
  /* REQUEST_STATUS_LABELS or BOOKING_STATUS_LABELS */
  statusLabels: Record<string, string>;

  dateFilter: string;
  areaFilter: string;
  ownerTypeFilter: "ALL" | OwnerType;
  eventTypeFilter: string;
  statusFilter: string;
  sortBy: SortBy;
  sortDirection: SortDirection;

  onDateFilterChange: (value: string) => void;
  onAreaFilterChange: (value: string) => void;
  onOwnerTypeFilterChange: (value: "ALL" | OwnerType) => void;
  onEventTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSortByChange: (value: SortBy) => void;
  onSortDirectionChange: (value: SortDirection) => void;
};

/** Shared filter bar for the requests and bookings tabs. */
export const AdminFilters: React.FC<Props> = ({
  areas,
  statusLabels,
  dateFilter,
  areaFilter,
  ownerTypeFilter,
  eventTypeFilter,
  statusFilter,
  sortBy,
  sortDirection,
  onDateFilterChange,
  onAreaFilterChange,
  onOwnerTypeFilterChange,
  onEventTypeFilterChange,
  onStatusFilterChange,
  onSortByChange,
  onSortDirectionChange,
}) => (
  <>
    <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(4, 1fr)" }}>
      <TextField
        type="date"
        label="Dato"
        InputLabelProps={{ shrink: true }}
        value={dateFilter}
        onChange={(event) => onDateFilterChange(event.target.value)}
      />
      <FormControl>
        <InputLabel>Område</InputLabel>
        <Select value={areaFilter} label="Område" onChange={(event) => onAreaFilterChange(event.target.value)}>
          <MenuItem value="ALL">Alle</MenuItem>
          {areas.map((areaOption) => (
            <MenuItem key={areaOption.id} value={areaOption.id}>
              {areaOption.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Eiertype</InputLabel>
        <Select
          value={ownerTypeFilter}
          label="Eiertype"
          onChange={(event) => onOwnerTypeFilterChange(event.target.value as "ALL" | OwnerType)}
        >
          <MenuItem value="ALL">Alle</MenuItem>
          <MenuItem value="PERSONAL">Personlig</MenuItem>
          <MenuItem value="ORGANIZATION">Forening</MenuItem>
          <MenuItem value="EXTERNAL">Ekstern</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Arrangementstype</InputLabel>
        <Select
          value={eventTypeFilter}
          label="Arrangementstype"
          onChange={(event) => onEventTypeFilterChange(event.target.value)}
        >
          <MenuItem value="ALL">Alle</MenuItem>
          {Object.entries(JANHUS_EVENT_TYPE_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}>
      <FormControl>
        <InputLabel>Status</InputLabel>
        <Select value={statusFilter} label="Status" onChange={(event) => onStatusFilterChange(event.target.value)}>
          <MenuItem value="ALL">Alle</MenuItem>
          {Object.entries(statusLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Sorter på</InputLabel>
        <Select value={sortBy} label="Sorter på" onChange={(event) => onSortByChange(event.target.value as SortBy)}>
          <MenuItem value="startsAt">Tid (fra)</MenuItem>
          <MenuItem value="area">Område</MenuItem>
          <MenuItem value="eventType">Arrangementstype</MenuItem>
          <MenuItem value="ownerType">Eiertype</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Retning</InputLabel>
        <Select
          value={sortDirection}
          label="Retning"
          onChange={(event) => onSortDirectionChange(event.target.value as SortDirection)}
        >
          <MenuItem value="asc">Stigende</MenuItem>
          <MenuItem value="desc">Synkende</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </>
);
