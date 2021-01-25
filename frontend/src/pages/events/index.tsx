import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Title } from "@components/ui/Typography";
import { NextPage } from "next";
import React from "react";
import AllEvents from "../../components/pages/events/AllEvents/index";

const Events: NextPage = () => {
  return (
    <Layout>
      <Content>
        <div>
          <Title>Arrangementer</Title>
        </div>

        <div>
          <AllEvents />
        </div>
      </Content>
    </Layout>
  );
};

export default Events;
