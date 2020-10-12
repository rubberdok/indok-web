import Link from "next/link";
import Calendar from "../../components/Calendar";
import { useState } from "react";
import moment from "moment";

const CabinHome = () => {
    const [selectedMonth, setSelectedMonth] = useState<moment.Moment>(moment());
    const randomDay = (max: number) => {
        return 1 + Math.floor((max - 1) * Math.random());
    };
    const generateRandomDays = (currentMonth: moment.Moment) => {
        const events = [];
        const maxDay = +currentMonth.endOf("month").format("D");
        for (let i = 0; i < 40; i++) {
            const newDate = moment(currentMonth);
            newDate.set("date", randomDay(maxDay));
            events.push(newDate);
        }
        return events;
    };
    return (
        <div>
            <h1>CabinHome </h1>
            <Link href="cabins/all">all bookings</Link>
            <Calendar onMonthSelected={setSelectedMonth} rangeChanged={(range) => console.log(range)} />
        </div>
    );
};
export default CabinHome;
