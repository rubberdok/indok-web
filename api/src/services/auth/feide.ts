import { env } from "../../config";

export type _UserInfo = {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  "dataporten-userid_sec": string[];
  "connect-userid_sec": string[];
};

export const fetchUserInfo = async (
  accessToken: string
): Promise<_UserInfo> => {
  return fetch("https://auth.dataporten.no/openid/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network request was unsuccessful");
      }
      return res.json();
    })
    .catch((error) => {
      throw new error("Failed to get user info", { cause: error });
    });
};

export type _TokenResponse = {
  access_token: string;
  id_token: string;
};

type Data = {
  code: string;
  grant_type: "authorization_code";
  redirect_uri: string;
  client_id: string;
};

export const fetchAccessToken = (data: Data): Promise<_TokenResponse> => {
  const httpBasicAuth = Buffer.from(
    `${env.FEIDE_CLIENT_ID}:${env.FEIDE_CLIENT_SECRET}`,
    "base64"
  ).toString("base64");

  const tokenPromise: Promise<_TokenResponse> = fetch(
    "https://auth.dataporten.no/oauth/token",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Basic ${httpBasicAuth}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network request was unsuccessful");
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error("Failed to get auth token", { cause: error });
    });
  return tokenPromise;
};
