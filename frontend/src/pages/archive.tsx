import { NextPage } from "next";
import Layout from "../components/Layout";
import React from "react";
import Button from "../components/pages/archive/FilterButtons";
import AllArchive from "@components/pages/archive/allArchive";

const Archive: NextPage = () => (
    <Layout>
        <div>
            <Button />
            <div style={{ flex: "100%" }}>
                <h1 style={{ alignSelf: "center" }}> Arkiv</h1>
            </div>
            <AllArchive />
        </div>
    </Layout>
);

export default Archive;
