import { gql } from "@apollo/client";

export const AUTHENTICATE = gql`
    mutation SocialAuth($provider: String!, $accessToken: String!) {
        socialAuth(provider: $provider, accessToken: $accessToken) {
            social {
                uid
                extraData
            }
        }
    }
`;
