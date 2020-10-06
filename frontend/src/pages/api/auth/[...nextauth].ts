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
    // database: {
    //     type: "postgres",
    //     host: "db",
    //     port: 5432,
    //     username: "postgres",
    //     password: "postgres",
    //     database: "postgres",
    //     synchronize: true,
    // },
    callbacks: {
        /**
         * @param  {object}  token     Decrypted JSON Web Token
         * @param  {object}  user      User object      (only available on sign in)
         * @param  {object}  account   Provider account (only available on sign in)
         * @param  {object}  profile   Provider profile (only available on sign in)
         * @param  {boolean} isNewUser True if new user (only available on sign in)
         * @return {object}            JSON Web Token that will be saved
         */
        jwt: async (token, user, account, profile, isNewUser) => {
            const isSignIn = user ? true : false;
            // Add data to token on sign-in
            if (isSignIn) {
                token.auth_time = Math.floor(Date.now() / 1000);
                token.accessToken = account.accessToken;
                token.userId = profile.id;
            }
            return Promise.resolve(token);
        },

        /**
         * @param  {object} session      Session object
         * @param  {object} user         User object    (if using database sessions)
         *                               JSON Web Token (if not using database sessions)
         * @return {object}              Session that will be returned to the client
         */
        session: async (session, user, sessionToken) => {
            // Add extended user data from jwt callback to session object
            const { auth_time, accessToken, userId } = user;
            session.user = { ...session.user, auth_time, accessToken, userId };
            return Promise.resolve(session);
        },
    },
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, options);
