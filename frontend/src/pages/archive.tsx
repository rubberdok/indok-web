import { NextPage } from "next";
import Layout from "../components/Layout";
import React from "react";
import AllDocuments from "../components/pages/archive/allDocuments";
import Button from "../components/pages/archive/FilterButtons";

const Archive: NextPage = () => (
    <Layout>
        <div>
            <Button />
            <div style={{ flex: "100%" }}>
                <h1 style={{ alignSelf: "center" }}> Arkiv</h1>
            </div>
            <AllDocuments />
        </div>
    </Layout>
);

export default Archive;
