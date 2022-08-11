import "reflect-metadata";

import crypto from "crypto";
import { Container } from "inversify";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import fetch, { Response as _Response } from "node-fetch";
import AuthService from "../../";
import { IAuthService, IUserService } from "../../../interfaces";
import types from "../../../types";
import { setupMocks } from "../__mocks__/feide";
import { OAuthCase } from "./interfaces";

const { Response: ActualResponse } = jest.requireActual<{
  Response: typeof _Response;
}>("node-fetch");

jest.mock("node-fetch");

const container = new Container();

describe("OAuth", () => {
  beforeAll(() => {
    const userService = mockDeep<IUserService>();

    container.unbindAll();
    container.bind<DeepMockProxy<IUserService>>(types.UserService).toConstantValue(userService);
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
    const expected = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
    expect(expected).toStrictEqual(codeChallenge);
  });

  const newUserCases: OAuthCase[] = [
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
  ];
  test.each(newUserCases)("authentication - $name", async ({ responses, expected }) => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    mockFetch.mockImplementation((url) => {
      const { json, status } = setupMocks(url, responses);
      const res = new ActualResponse(undefined, { status });
      res.json = json;
      return Promise.resolve(res);
    });

    const mockUserService = container.get<DeepMockProxy<IUserService>>(types.UserService);

    mockUserService.getByFeideID.mockReturnValueOnce(Promise.resolve(expected));
    mockUserService.login.mockReturnValueOnce(Promise.resolve(expected));

    const auth = container.get<IAuthService>(types.AuthService);
    const user = await auth.getUser({
      code: "code",
      codeVerifier: "verifier",
    });

    expect(user).toEqual(expected);
    expect(mockUserService.getByFeideID).toHaveBeenCalledWith((await expected).feideId);
    expect(mockUserService.create).not.toHaveBeenCalled();
  });

  const existingUserCases: OAuthCase[] = [
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
            "dataporten-userid_sec": ["existing@ntnu.no"],
            email: "existing@example.com",
          },
        },
      },
      expected: {
        username: "existing",
        feideId: "feide_id",
        id: "id",
        firstName: "first",
        lastName: "last",
        email: "existing@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        graduationYear: null,
        firstLogin: false,
        graduationYearUpdatedAt: null,
        allergies: null,
        phoneNumber: "40000000",
      },
    },
  ];
  test.each(existingUserCases)("authentication - $name", async ({ responses, expected }) => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    mockFetch.mockImplementation((url) => {
      const { json, status } = setupMocks(url, responses);
      const res = new ActualResponse(undefined, { status });
      res.json = json;
      return Promise.resolve(res);
    });

    const mockUserService = container.get<DeepMockProxy<IUserService>>(types.UserService);

    mockUserService.getByFeideID.mockReturnValueOnce(Promise.resolve(null));
    mockUserService.create.mockReturnValueOnce(Promise.resolve(expected));

    const auth = container.get<IAuthService>(types.AuthService);
    const user = await auth.getUser({
      code: "code",
      codeVerifier: "verifier",
    });

    expect(user).toEqual(expected);
    expect(mockUserService.getByFeideID).toHaveBeenCalledWith((await expected).feideId);

    const { username, feideId, firstName, lastName, email } = expected;
    expect(mockUserService.create).toHaveBeenCalledWith({
      username,
      feideId,
      firstName,
      lastName,
      email,
    });
  });
});
