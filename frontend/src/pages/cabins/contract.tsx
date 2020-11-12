import Layout from "@components/Layout";
import Contract from "@components/pages/cabins/Contract";

import styled from "styled-components";
import { ContractProps } from "../../components/pages/cabins/Contract";

const ContractPage = () => {
    const contractData = {
        firstname: "Herman",
        surname: "Holmøy",
        cabin: "Bjørnen",
        fromDate: "2020-01-01",
        toDate: "2020-02-02",
        price: 3000,
    };

    return (
        <>
            <Layout>
                <Container>
                    <Contract data={contractData}></Contract>
                </Container>
            </Layout>
        </>
    );
};

const Container = styled.div`
    margin: auto;
    width: 70%;
    padding: 50px;
`;

export default ContractPage;
