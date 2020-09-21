import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Application from "../components/application"
import TextField from "../components/application_components/textfield"
import Choice from "../components/application_components/choice"
import Dropdown from "../components/application_components/dropdown"
import Slider from "../components/application_components/slider"

const ApplicationPage: NextPage = () => (
    <Layout>
        <Link href="/"><a>Back to index</a></Link>
        <Application>
            <TextField title="Test input" placeholder="Type text here"/>
            <br/>
            <Choice title="Test radio buttons" radio options={["test1", "test2"]}/>
            <br/>
            <Choice title="Test checkbox" options={["test3", "test4"]}/>
            <br/>
            <Dropdown title="Test dropdown" options={["test5", "test6", "test7"]}/>
            <br/>
            <Slider title="Test slider" range={[0, 50]} placeholder={10}/>
        </Application>
    </Layout>
);

export default ApplicationPage;