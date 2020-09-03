import { NextPage } from "next";
import Link from "next/link";

const TestPage: NextPage = () => (
    <div>
        <h1> Test page</h1>
        <Link href="/">back to home</Link>
    </div>
);

export default TestPage;
