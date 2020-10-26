import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/Layout";

const SurveyPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
    
};


export const getServerSideProps: GetServerSideProps<{ id: string[] }> = async (context) => {
    const id = context.query.id as string[];
    return {
        props: { id },
    };
};