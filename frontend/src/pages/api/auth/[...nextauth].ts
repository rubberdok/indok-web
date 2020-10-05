import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
    // Configure one or more authentication providers
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],

    // A database is optional, but required to persist accounts in a database
    database: {
        type: "postgres",
        host: "db",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "postgres",
        synchronize: true,
    },
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, options);
