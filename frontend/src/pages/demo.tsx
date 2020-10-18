import { NextPage } from "next";
import Layout from "@components/Layout";
import Link from "next/link";

const Demo: NextPage = () => {
    return (
        <Layout>
            <h3>Demoside for vervsøknad</h3>
            <Link href="/listings">Vervoversikten</Link>
            <br />
            <Link href="/org">Foreningenes side for behandling av søknader</Link>
        </Layout>
    );
};

export default Demo;
