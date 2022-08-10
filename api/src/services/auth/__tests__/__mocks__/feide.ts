import { RequestInfo } from "node-fetch";
import { UserInfo } from "../../interfaces";
import { OAuthCase } from "../unit/interfaces";

export interface FeideResponses {
  token: {
    status: number;
    data: {
      access_token: string;
      id_token: string;
    };
  };
  userInfo: {
    status: number;
    data: UserInfo;
  };
}

export const setupMocks = (
  url: URL | RequestInfo,
  responses: FeideResponses
) => {
  switch (url) {
    case "https://auth.dataporten.no/oauth/token":
      return {
        json: () => Promise.resolve(responses.token.data),
        status: responses.token.status,
      };
    case "https://auth.dataporten.no/openid/userinfo":
      return {
        json: () => Promise.resolve(responses.userInfo.data),
        status: responses.userInfo.status,
      };
    default:
      return { json: () => Promise.resolve(null), status: 200 };
  }
};
