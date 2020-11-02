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
    debug: true,
    callbacks: {
        /**
         * @param  {object} user     User object
         * @param  {object} account  Provider account
         * @param  {object} profile  Provider profile
         * @return {boolean}         Return `true` (or a modified JWT) to allow sign in
         *                           Return `false` to deny access
         */
        signIn: async (user, account, profile) => {
            const isAllowedToSignIn = true;

            // Authenticate with backend after frontend signin
            await fetch("http://localhost:8000/", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify({
                    query: `mutation{
                        socialAuth(provider: ${"google-oauth2"}, accessToken: ${account.accessToken}") {
                            social {
                                uid
                                extraData
                            }
                        }
                    }`,
                }),
            })
                .then((res) => {
                    console.log("then");
                    console.log(res);
                })
                .catch((error) => {
                    console.log("catch");
                    // isAllowedToSignIn = false;
                    console.log(error);
                });

            if (isAllowedToSignIn) {
                return Promise.resolve(true);
            } else {
                // Return false to display a default error message
                return Promise.resolve(false);
                // You can also Reject this callback with an Error or with a URL:
                // return Promise.reject(new Error('error message')) // Redirect to error page
                // return Promise.reject('/path/to/redirect')        // Redirect to a URL
            }
        },
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
                token.authTime = Math.floor(Date.now() / 1000);
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
        session: async (session, user) => {
            // Add extended user data from jwt callback to session object
            const { authTime, accessToken, userId } = user;
            session.user = { ...session.user, authTime, accessToken, userId };

            return Promise.resolve(session);
        },
    },
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, options);
