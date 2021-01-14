import Layout from "@components/Layout";
import Rules from "@components/pages/cabins/Rules";
import styled from "styled-components";

const RulesPage = () => {
    return (
        <>
            <Layout>
                <Container>
                    <Rules></Rules>
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

export default RulesPage;
