import Link from "next/link";
import Calendar from "react-calendar";

const CabinHome = () => (
    <div>
        <h1>CabinHome </h1>
        <Link href="cabins/all">all bookings</Link>
        <Calendar onChange={(date) => console.log(date)} />
    </div>
);

export default CabinHome;
