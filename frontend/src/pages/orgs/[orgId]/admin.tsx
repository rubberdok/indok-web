import Layout from "@components/Layout";
import { NextPage } from "next";
import EditUsersInOrganization from "@components/pages/orgs/UserAdmin/UserAdmin";


const AdminPage: NextPage = () =>{

    return(
        <Layout>
          <EditUsersInOrganization/>
        </Layout>
    );
}

export default AdminPage;
