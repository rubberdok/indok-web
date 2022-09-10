import crypto from "crypto";

import { User } from "@prisma/client";
import { inject, injectable } from "inversify";
import fetch from "node-fetch";

import { env } from "@/config";
import { GetUserParams, IAuthService, IUserService } from "@/services/interfaces";
import { default as Types } from "@/services/types";

import { UserInfo } from "./interfaces";

const FeideProvider = {
  token: env.FEIDE_BASE_URL + "/oauth/token",
  authorization: env.FEIDE_BASE_URL + "/oauth/authorization",
  redirectURL: env.FEIDE_REDIRECT_URI,
  clientID: env.FEIDE_CLIENT_ID,
  userInfo: env.FEIDE_BASE_URL + "/openid/userinfo",
};

@injectable()
export default class FeideService implements IAuthService {
  constructor(@inject(Types.UserService) private userService: IUserService) {}

  private scope = ["openid", "userid", "userid-feide", "userinfo-name", "userinfo-photo", "email", "groups-edu"].join(
    " "
  );

  ssoUrl(state?: string | null): {
    url: string;
    codeChallenge: string;
    codeVerifier: string;
  } {
    const { codeVerifier, codeChallenge } = this.pkce();
    return {
      url:
        `${FeideProvider.authorization}?client_id=${env.FEIDE_CLIENT_ID}&scope=${this.scope}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=${env.FEIDE_REDIRECT_URI}` +
        (state ? `&state=${state}` : ""),
      codeVerifier,
      codeChallenge,
    };
  }

  async getUser({ code, codeVerifier }: GetUserParams): Promise<User> {
    const accessToken = await this.getAccessToken(code, codeVerifier);
    const userInfo = await this.getUserInfo(accessToken);
    const { email, sub: feideId, name } = userInfo;

    const user = await this.userService.getByFeideID(feideId);
    if (!user) {
      const [firstName, lastName] = name.split(" ");
      const userId = userInfo["dataporten-userid_sec"].find((id) => id.endsWith("@ntnu.no")) ?? userInfo.email;
      const username = userId.slice(userId.indexOf(":") + 1, userId.indexOf("@"));

      return this.userService.create({
        email,
        firstName,
        lastName,
        feideId,
        username,
      });
    } else {
      return this.userService.login(user.id);
    }
  }

  private async getUserInfo(accessToken: string): Promise<UserInfo> {
    const url = FeideProvider.userInfo;
    const authorization = `Bearer ${accessToken}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        authorization,
      },
    });

    if (res.ok) {
      const json: UserInfo = await res.json();
      return json;
    } else {
      const reason = await res.text();
      throw new Error(reason);
    }
  }

  private async getAccessToken(code: string, codeVerifier: string): Promise<string> {
    const url = FeideProvider.token;

    // https://en.wikipedia.org/wiki/Basic_access_authentication
    const authorization =
      "Basic " + Buffer.from(`${env.FEIDE_CLIENT_ID}:${env.FEIDE_CLIENT_SECRET}`).toString("base64url");

    const data = {
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
      code,
      redirect_uri: FeideProvider.redirectURL,
      client_id: FeideProvider.clientID,
    };

    const params = new URLSearchParams(data);

    const res = await fetch(url, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization,
      },
    });

    if (res.ok) {
      const json: { access_token: string; id_token: string } = await res.json();
      return json.access_token;
    } else {
      const reason = await res.text();
      throw new Error(reason);
    }
  }

  private pkce(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");

    return { codeVerifier, codeChallenge };
  }
}
