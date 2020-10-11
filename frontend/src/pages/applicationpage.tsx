import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import ResponseForm from "../components/pages/listings/responseForm";
import TextField from "../components/pages/listings/textfield";
import Choice from "../components/pages/listings/choice";
import Dropdown from "../components/pages/listings/dropdown";
import Slider from "../components/pages/listings/slider";

const ApplicationPage: NextPage = () => (
    <Layout>
        <Link href="/">Back to index</Link>
        <ResponseForm>
            <TextField title="Test input" placeholder="Type text here" size="short" />
            <br />
            <Choice title="Test radio buttons" radio options={["test1", "test2"]} />
            <br />
            <Choice title="Test checkbox" options={["test3", "test4"]} />
            <br />
            <Dropdown title="Test dropdown" options={["test5", "test6", "test7"]} />
            <br />
            <Slider title="Test slider" range={[0, 50]} placeholder={10} />
        </ResponseForm>
    </Layout>
);

export default ApplicationPage;
