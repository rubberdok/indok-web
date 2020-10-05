import { useSession } from "next-auth/client";
import Layout from "../components/Layout";

const Profile = () => {
    const [session, loading] = useSession();

    if (loading) return <div>loading...</div>;
    if (!session) return <div>no session</div>;

    return (
        <Layout>
            {session && (
                <>
                    <img src={session.user.image} className="avatar" alt="user-avatar" />
                    <h1>{session.user.name}</h1>
                </>
            )}

            <style jsx>{`
                .avatar {
                    width: 220px;
                    border-radius: 10px;
                }
            `}</style>
        </Layout>
    );
};

export default Profile;
