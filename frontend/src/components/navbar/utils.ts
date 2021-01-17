export const generateAuthURL = (
  client_id?: string,
  state?: string,
  redirect_uri?: string,
  scopes?: string[]
): string => {
  if (!client_id || !redirect_uri || !scopes) {
    return "/";
  }
  let signInURL = "https://auth.dataporten.no/oauth/authorization";
  signInURL += `?client_id=${client_id}`;
  signInURL += `&state=${state}`;
  signInURL += `&redirect_uri=${redirect_uri}`;
  signInURL += `&response_type=code`;
  signInURL += `&scope=${scopes.join("%20")}`;

  return signInURL;
};

export const DATAPORTEN_SCOPES = [
  "openid",
  "userid",
  "userid-feide",
  "userinfo-name",
  "userinfo-photo",
  "email",
  "groups-edu",
];
