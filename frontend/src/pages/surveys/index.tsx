import { NextPage } from "next";
import Layout from "@components/Layout";
import Link from "next/link";

const IndexPage: NextPage = () => (
  <Layout>
    <h3>Spørreundersøkelser</h3>
    <Link href="surveys/new">
      <button>Lag ny spørreundersøkelse</button>
    </Link>
  </Layout>
);
export default IndexPage;
