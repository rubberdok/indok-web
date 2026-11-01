import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import { JANHUS_EVENT_TYPE_LABELS, OwnerType, SortBy, SortDirection } from "@/components/pages/janhus/constants";

import type { AdminFilterControls } from "./useFilteredAdminRows";

type AreaOption = { id: string; name: string };

type Props = {
  areas: readonly AreaOption[];
  /* REQUEST_STATUS_LABELS or BOOKING_STATUS_LABELS */
  statusLabels: Record<string, string>;
  filters: AdminFilterControls;
};

/** Shared filter bar for the requests and bookings tabs. */
export const AdminFilters: React.FC<Props> = ({
  areas,
  statusLabels,
  filters: {
    dateFilter,
    areaFilter,
    ownerTypeFilter,
    eventTypeFilter,
    statusFilter,
    sortBy,
    sortDirection,
    setDateFilter,
    setAreaFilter,
    setOwnerTypeFilter,
    setEventTypeFilter,
    setStatusFilter,
    setSortBy,
    setSortDirection,
  },
}) => (
  <>
    <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "repeat(4, 1fr)" }}>
      <TextField
        type="date"
        label="Dato"
        InputLabelProps={{ shrink: true }}
        value={dateFilter}
        onChange={(event) => setDateFilter(event.target.value)}
      />
      <FormControl>
        <InputLabel>Område</InputLabel>
        <Select value={areaFilter} label="Område" onChange={(event) => setAreaFilter(event.target.value)}>
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
          onChange={(event) => setOwnerTypeFilter(event.target.value as "ALL" | OwnerType)}
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
          onChange={(event) => setEventTypeFilter(event.target.value)}
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
        <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
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
        <Select value={sortBy} label="Sorter på" onChange={(event) => setSortBy(event.target.value as SortBy)}>
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
          onChange={(event) => setSortDirection(event.target.value as SortDirection)}
        >
          <MenuItem value="asc">Stigende</MenuItem>
          <MenuItem value="desc">Synkende</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </>
);
