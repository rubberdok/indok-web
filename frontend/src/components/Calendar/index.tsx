import { useState } from "react";
import moment from "moment";

const Calendar = () => {
    const [selectedDay, setSelectedDay] = useState < moment.Moment > moment();
    return <div>{selectedDay.format("LT")}</div>;
};
