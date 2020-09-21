import { NextPage } from "next";
import Link from "next/link";
import TextField from "./application_components/textfield"

const Application = ({ children }: { children: React.ReactNode}) => (
    <>
        {children}
    </>
);

export default Application;