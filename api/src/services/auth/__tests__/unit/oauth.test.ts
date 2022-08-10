import "reflect-metadata";

import crypto from "crypto";
import { Container } from "inversify";
import { DeepMockProxy } from "jest-mock-extended";
import fetch, { Response as _Response } from "node-fetch";
import AuthService from "../../";
import { IAuthService, IUserService } from "../../../interfaces";
import types from "../../../types";
import { setupMocks } from "../__mocks__/feide";
import { OAuthCase } from "./interfaces";
import { default as _MockUserService } from "../__mocks__/UserService";

const { Response: ActualResponse } = jest.requireActual<{
  Response: typeof _Response;
}>("node-fetch");
interface MockUserService extends DeepMockProxy<_MockUserService> {}

jest.mock("node-fetch");
jest.mock("../__mocks__/UserService");

const container = new Container();

describe("OAuth", () => {
  beforeAll(() => {
    const userService =
      new _MockUserService() as unknown as DeepMockProxy<_MockUserService>;

    container.unbindAll();
    container
      .bind<MockUserService>(types.UserService)
      .toConstantValue(userService);
    container.bind<IAuthService>(types.AuthService).to(AuthService);
  });

  it("should generate a login url with PKCE params", () => {
    const auth = container.get<IAuthService>(types.AuthService);
    const { url, codeChallenge } = auth.ssoUrl();
    expect(url).toContain(`code_challenge=${codeChallenge}`);
    expect(url).toContain("code_challenge_method=S256");
  });

  it("should generate a valid code challenge", () => {
    const auth = container.get<IAuthService>(types.AuthService);
    const { codeChallenge, codeVerifier } = auth.ssoUrl();
    const expected = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    expect(expected).toStrictEqual(codeChallenge);
  });

  const cases: OAuthCase[] = [
    {
      name: "should create a new user if one does not exist",
      responses: {
        token: {
          status: 200,
          data: {
            access_token: "access_token",
            id_token: "id_token",
          },
        },
        userInfo: {
          status: 200,
          data: {
            sub: "feide_id",
            name: "first last",
            "dataporten-userid_sec": ["example@ntnu.no"],
            email: "example@example.com",
          },
        },
      },
      expected: {
        username: "example",
        feideId: "feide_id",
        id: "id",
        firstName: "first",
        lastName: "last",
        email: "example@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
    },
    {
      name: "should fetch an existing user",
      responses: {
        token: {
          status: 200,
          data: {
            access_token: "access_token",
            id_token: "id_token",
          },
        },
        userInfo: {
          status: 200,
          data: {
            sub: "feide_id",
            name: "first last",
            "dataporten-userid_sec": ["example@ntnu.no"],
            email: "example@example.com",
          },
        },
      },
      expected: {
        username: "exists",
        feideId: "feide_id",
        id: "id",
        firstName: "first",
        lastName: "last",
        email: "exists@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
      },
    },
  ];
  test.each(cases)(
    "authentication - $name",
    async ({ responses, expected }) => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

      mockFetch.mockImplementation((url) => {
        const { json, status } = setupMocks(url, responses);
        const res = new ActualResponse(undefined, { status });
        res.json = json;
        return Promise.resolve(res);
      });

      const mockUserService = container.get<DeepMockProxy<IUserService>>(
        types.UserService
      );

      mockUserService.getByFeideID.mockReturnValueOnce(
        Promise.resolve(expected)
      );
      mockUserService.login.mockReturnValueOnce(Promise.resolve(expected));

      const auth = container.get<IAuthService>(types.AuthService);
      const user = await auth.getUser({
        code: "code",
        encryptedCodeVerifier: "verifier",
      });

      console.log({ user });

      expect(user).toEqual(expected);
      expect(mockUserService.getByFeideID).toHaveBeenCalledWith(
        (await expected).feideId
      );
      expect(mockUserService.create).not.toHaveBeenCalled();
    }
  );
});
