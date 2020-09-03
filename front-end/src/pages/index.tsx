import { NextPage } from "next";
import Link from "next/link";

const IndexPage: NextPage = () => (
    <div>
        <h1>Velkommen til Indøkntnu.no </h1>
        <Link href="/testpage">test link</Link>
    </div>
);

export default IndexPage;
