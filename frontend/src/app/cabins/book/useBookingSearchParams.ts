import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "@/lib/date";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

function useBookingSearchParams() {
  const searchParams = useSearchParams();

  const checkInSearchParam = searchParams?.get("checkIn");
  const checkOutSearchParam = searchParams?.get("checkOut");
  const cabinsSearchParam = searchParams?.getAll("cabin");

  const checkIn =
    checkInSearchParam && dayjs(checkInSearchParam).isValid() ? dayjs(checkInSearchParam).toDate() : undefined;
  const checkOut =
    checkOutSearchParam && dayjs(checkOutSearchParam).isValid() ? dayjs(checkOutSearchParam).toDate() : undefined;
  const selectedCabins = cabinsSearchParam ?? [];

  const router = useRouter();
  const pathname = usePathname();

  const toSearchParams = useCallback(
    (data: { cabins: string[] | undefined; checkIn: string | undefined; checkOut: string | undefined }) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (data.cabins) {
        params.delete("cabin");
        data.cabins.forEach((cabin) => params.append("cabin", cabin));
      } else {
        params.delete("cabin");
      }
      if (data.checkIn) {
        params.set("checkIn", data.checkIn);
      } else {
        params.delete("checkIn");
      }
      if (data.checkOut) {
        params.set("checkOut", data.checkOut);
      } else {
        params.delete("checkOut");
      }
      return params.toString();
    },
    [searchParams]
  );

  const onBookingChange = useCallback(
    (data: { cabins: string[] | undefined; checkIn: string | undefined; checkOut: string | undefined }) => {
      router.replace(`${pathname}?${toSearchParams(data)}`, { scroll: false });
    },
    [searchParams]
  );

  return { checkIn, checkOut, selectedCabins, onBookingChange };
}

export { useBookingSearchParams };
