import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

import type { OwnerType, SortBy, SortDirection } from "@/components/pages/janhus/constants";
import { toDateKey } from "@/components/pages/janhus/helpers";

type AdminFilterableRow = {
  startsAt: string;
  area: { id: string; name: string };
  status: string;
  eventType: string;
};

type AdminRowFilters = {
  date: string;
  area: string;
  status: string;
  eventType: string;
  ownerType: "ALL" | OwnerType;
};

export type AdminFilterControls = {
  dateFilter: string;
  setDateFilter: Dispatch<SetStateAction<string>>;
  areaFilter: string;
  setAreaFilter: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  eventTypeFilter: string;
  setEventTypeFilter: Dispatch<SetStateAction<string>>;
  ownerTypeFilter: "ALL" | OwnerType;
  setOwnerTypeFilter: Dispatch<SetStateAction<"ALL" | OwnerType>>;
  sortBy: SortBy;
  setSortBy: Dispatch<SetStateAction<SortBy>>;
  sortDirection: SortDirection;
  setSortDirection: Dispatch<SetStateAction<SortDirection>>;
};

export type AdminFilterState<T extends AdminFilterableRow> = AdminFilterControls & { filteredRows: T[] };

function matchesAdminFilters<T extends AdminFilterableRow>(
  row: T,
  filters: AdminRowFilters,
  getOwnerType: (row: T) => OwnerType
) {
  if (filters.date && toDateKey(row.startsAt) !== filters.date) return false;
  if (filters.area !== "ALL" && row.area.id !== filters.area) return false;
  if (filters.status !== "ALL" && row.status !== filters.status) return false;
  if (filters.eventType !== "ALL" && row.eventType !== filters.eventType) return false;
  if (filters.ownerType !== "ALL" && getOwnerType(row) !== filters.ownerType) return false;
  return true;
}

function compareAdminRows<T extends AdminFilterableRow>(
  left: T,
  right: T,
  sortBy: SortBy,
  getOwnerType: (row: T) => OwnerType
) {
  if (sortBy === "startsAt") {
    return new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime();
  }
  if (sortBy === "area") {
    return left.area.name.localeCompare(right.area.name);
  }
  if (sortBy === "eventType") {
    return left.eventType.localeCompare(right.eventType);
  }
  if (sortBy === "status") {
    return left.status.localeCompare(right.status);
  }
  return getOwnerType(left).localeCompare(getOwnerType(right));
}

function filterAndSortAdminRows<T extends AdminFilterableRow>(
  rows: T[],
  filters: AdminRowFilters,
  sortBy: SortBy,
  sortDirection: SortDirection,
  getOwnerType: (row: T) => OwnerType
) {
  const sortFactor = sortDirection === "asc" ? 1 : -1;
  return [...rows]
    .filter((row) => matchesAdminFilters(row, filters, getOwnerType))
    .sort((left, right) => compareAdminRows(left, right, sortBy, getOwnerType) * sortFactor);
}

export function useFilteredAdminRows<T extends AdminFilterableRow>(
  rows: T[],
  getOwnerType: (row: T) => OwnerType,
  initialSortBy: SortBy
) {
  const [dateFilter, setDateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");
  const [ownerTypeFilter, setOwnerTypeFilter] = useState<"ALL" | OwnerType>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const filteredRows = useMemo(
    () =>
      filterAndSortAdminRows(
        rows,
        {
          date: dateFilter,
          area: areaFilter,
          status: statusFilter,
          eventType: eventTypeFilter,
          ownerType: ownerTypeFilter,
        },
        sortBy,
        sortDirection,
        getOwnerType
      ),
    [areaFilter, dateFilter, eventTypeFilter, getOwnerType, ownerTypeFilter, rows, sortBy, sortDirection, statusFilter]
  );
  return {
    filteredRows,
    dateFilter,
    setDateFilter,
    areaFilter,
    setAreaFilter,
    statusFilter,
    setStatusFilter,
    eventTypeFilter,
    setEventTypeFilter,
    ownerTypeFilter,
    setOwnerTypeFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  };
}
