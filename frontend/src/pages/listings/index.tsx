import { NextPage } from "next";
import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import AllListings from "@components/pages/listings/allListings";
import { Title } from "@components/ui/Typography";

const IndexPage: NextPage = () => 
<Layout>
  <Content>
    <Title>Stillingsannonser</Title>
    <AllListings/>
  </Content>
</Layout>
;

export default IndexPage;