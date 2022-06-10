import { config } from "./config";
import { toQuery } from "./helpers";

const DATAPORTEN_SCOPES = [
  "openid",
  "userid",
  "userid-feide",
  "userinfo-name",
  "userinfo-photo",
  "email",
  "groups-edu",
];

export const generateFeideLoginUrl = (redirect?: string) => {
  const queryString = toQuery({
    client_id: config.DATAPORTEN_ID,
    state: redirect,
    redirect_uri: config.DATAPORTEN_REDIRECT_URI,
    response_type: "code",
    scope: DATAPORTEN_SCOPES.join(" "),
  });
  return config.FEIDE_AUTHORIZATION_URI + queryString;
};
