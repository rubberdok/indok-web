import { QueryVariables } from "../../../interfaces/cabins";
import { FC } from "react";

interface Props {
    queryVariables: QueryVariables;
}

export const BookingsFor: FC<Props> = ({ queryVariables }) => {
    const month_index = parseInt(queryVariables.month) - 1;
    const year = queryVariables.year;

    const months = [
        "Januar",
        "Februar",
        "Mars",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];
    const month = months[month_index];
    return (
        <>
            <h3>
                Bookinger for {month} {year}
            </h3>
        </>
    );
};
