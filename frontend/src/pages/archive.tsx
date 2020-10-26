import { NextPage } from "next";
import Layout from "../components/Layout";
import React from "react";
import AllArchive from "../components/pages/archive/allArchive";
import Button from "../components/pages/archive/FilterButtons";
import { Title, SubTitle, Heading, SubHeading, Paragraph } from "@components/ui/Typography";

const Archive: NextPage = () => (
    <Layout>
        <div>
            <Button />
            <div style={{ flex: "100%" }}>
                <Title style={{ textAlign: "center" }}> Arkiv</Title>
            </div>
            <AllArchive />
        </div>
    </Layout>
);

export default Archive;
