import { Prisma, User } from "@prisma/client";
import { env } from "../../config";
import { AuthRepository } from "../../repository/auth";
import { UsersRepository } from "../../repository/users";
import { SCOPE } from "./constants";
import { fetchAccessToken, fetchUserInfo } from "./feide";
import { pkce } from "./oauth";

type TokenResponse = {
  accessToken: string;
  idToken: string;
};

/**
 * https://docs.feide.no/service_providers/openid_connect/feide_obtaining_tokens.html
 */
const getToken = async (
  code: string,
  codeVerifier: string
): Promise<TokenResponse> => {
  const data = {
    code,
    grant_type: "authorization_code",
    redirect_uri: env.FEIDE_REDIRECT_URI,
    client_id: env.FEIDE_CLIENT_ID,
    code_verifier: codeVerifier,
  } as const;
  const { access_token: accessToken, id_token: idToken } =
    await fetchAccessToken(data);
  return { accessToken, idToken };
};

const getUserInfo = (accessToken: string): Promise<Prisma.UserCreateInput> => {
  return fetchUserInfo(accessToken).then((data) => {
    const [firstName, lastName] = data.name.split(" ", 1);

    let username = data["dataporten-userid_sec"].find((id) =>
      id.endsWith("@ntnu.no")
    );
    if (typeof username !== "undefined") {
      username = username.slice(
        username.indexOf(":") + 1,
        username.indexOf("@")
      );
    } else {
      username = data.email.slice(0, data.email.indexOf("@"));
    }

    return {
      feideId: data.sub,
      email: data.email,
      firstName,
      lastName,
      username,
    };
  });
};

type Dependencies = {
  usersRepository: UsersRepository;
  authRepository: AuthRepository;
};

export const AuthenticationService = ({
  usersRepository,
  authRepository,
}: Dependencies) => ({
  /**
   * https://docs.feide.no/service_providers/openid_connect/feide_obtaining_tokens.html
   */
  authenticate: async (code: string, id: string): Promise<User> => {
    const { codeVerifier } = await authRepository.retrieveCodeVerifier(id);
    const token = await getToken(code, codeVerifier);
    // pkce
    const userInfo = await getUserInfo(token.accessToken);
    try {
      return usersRepository.getByFeideId(userInfo.feideId);
    } catch {
      return usersRepository.create(userInfo);
    }
  },
  generateLoginUrl: async (): Promise<string> => {
    const { codeVerifier, codeChallenge } = pkce();
    const { id } = await authRepository.addCodeVerifier(codeVerifier);
    return `https://auth.dataporten.no/oauth/authorize?response_type=code&client_id=${env.FEIDE_CLIENT_ID}&redirect_uri=${env.FEIDE_REDIRECT_URI}&scope=${SCOPE}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${id}`;
  },
});

export type AuthService = ReturnType<typeof AuthenticationService>;
