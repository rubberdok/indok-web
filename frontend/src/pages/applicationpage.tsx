import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Application from "../components/application"
import TextField from "../components/application_components/textfield"
import Choice from "../components/application_components/choice"

const ApplicationPage: NextPage = () => (
    <Layout>
        <Link href="/"><a>Back to index</a></Link>
        <Application>
            <TextField title="Test input" placeholder="Type text here"/>
            <br/>
            <Choice title="Test radio buttons" radio={true} options={["test1", "test2"]}/>
            <br/>
            <Choice title="Test checkbox" radio={false} options={["test3", "test4"]}/>
        </Application>
    </Layout>
);

export default ApplicationPage;