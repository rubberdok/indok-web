import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Application from "../components/application"
import TextField from "../components/application_components/textfield"
import SingleChoice from "../components/application_components/singlechoice"
import MultiChoice from "../components/application_components/multichoice"

const ApplicationPage: NextPage = () => (
    <Layout>
        <Application>
            <TextField title="Test input"/>
            <br/>
            <SingleChoice title="Test radio buttons" options={["test1", "test2"]}/>
            <br/>
            <MultiChoice title="Test checkbox" options={["test3", "test4"]}/>
        </Application>
    </Layout>
);

export default ApplicationPage;