import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import ListingResponse from "../components/ListingResponse";
import TextField from "../components/listing_components/textfield";
import Choice from "../components/listing_components/choice";
import Dropdown from "../components/listing_components/dropdown";
import Slider from "../components/listing_components/slider";

const ApplicationPage: NextPage = () => (
    <Layout>
        <Link href="/">
            <a>Back to index</a>
        </Link>
        <ListingResponse>
            <TextField title="Test input" placeholder="Type text here" size="short" />
            <br />
            <Choice title="Test radio buttons" radio options={["test1", "test2"]} />
            <br />
            <Choice title="Test checkbox" options={["test3", "test4"]} />
            <br />
            <Dropdown title="Test dropdown" options={["test5", "test6", "test7"]} />
            <br />
            <Slider title="Test slider" range={[0, 50]} placeholder={10} />
        </ListingResponse>
    </Layout>
);

export default ApplicationPage;
