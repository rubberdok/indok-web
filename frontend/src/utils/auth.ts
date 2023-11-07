import { config } from "./config";

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
  const queryString = new URLSearchParams({
    client_id: config.DATAPORTEN_ID,
    redirect_uri: config.DATAPORTEN_REDIRECT_URI,
    response_type: "code",
    scope: DATAPORTEN_SCOPES.join(" "),
    ...(redirect && { state: redirect }),
  });
  return `${config.FEIDE_AUTHORIZATION_URI}?${queryString.toString()}`;
};
