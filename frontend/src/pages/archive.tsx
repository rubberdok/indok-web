import { NextPage } from "next";
import Layout from "../components/Layout";
import React from "react";
import DocumentListView from "../components/pages/archive/documentListView";

const Archive: NextPage = () => (
    <Layout>
        <div>
            <DocumentListView />
        </div>
    </Layout>
);

export default Archive;
