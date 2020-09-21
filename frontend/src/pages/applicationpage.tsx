import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Application from "../components/application"
import TextField from "../components/application_components/textfield"

const ApplicationPage: NextPage = () => (
    <Layout>
        <Application>
            <TextField title="Test input"/>
        </Application>
    </Layout>
);

export default ApplicationPage;