import { User } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import { AuthenticationService } from "../..";
import { AuthRepository } from "../../../../repository/auth";
import { UsersRepository } from "../../../../repository/users";
import { _TokenResponse, _UserInfo } from "../../feide";

type Table = {
  name: string;
  responses: {
    token: {
      ok: boolean;
      data: _TokenResponse;
    };
    userInfo: {
      ok: boolean;
      data: _UserInfo;
    };
  };
  expected: Promise<User>;
}[];

const cases: Table = [
  {
    name: "new user, no errors",
    responses: {
      token: {
        ok: true,
        data: {
          access_token: "asdf",
          id_token: "qwerty",
        },
      },
      userInfo: {
        ok: true,
        data: {
          sub: "feide_id",
          name: "first middle last",
          email: "example@example.com",
          email_verified: true,
          "dataporten-userid_sec": ["feide:example@ntnu.no"],
          "connect-userid_sec": [],
        },
      },
    },
    expected: Promise.resolve({
      username: "example",
      feideId: "feide_id",
      id: "id",
      firstName: "first",
      lastName: "last",
      email: "example@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    }),
  },
];

test.each(cases)("authenticate - $name", async ({ responses, expected }) => {
  const mockRepo = mockDeep<UsersRepository>();
  const mockAuth = mockDeep<AuthRepository>();
  const service = AuthenticationService({
    usersRepository: mockRepo,
    authRepository: mockAuth,
  });

  const setupMocks = (url: URL | RequestInfo) => {
    switch (url) {
      case "https://auth.dataporten.no/oauth/token":
        return {
          json: () => Promise.resolve(responses.token.data),
          ok: responses.token.ok,
        };
      case "https://auth.dataporten.no/openid/userinfo":
        return {
          json: () => Promise.resolve(responses.userInfo.data),
          ok: responses.userInfo.ok,
        };
      default:
        return { json: () => Promise.resolve(null), ok: false };
    }
  };

  jest.spyOn(global, "fetch").mockImplementation((url) => {
    const { json, ok } = setupMocks(url);
    return Promise.resolve({
      ...new Response(),
      ok,
      json,
    });
  });

  mockRepo.getByFeideId.mockReturnValue(Promise.resolve(expected));
  mockRepo.create.mockReturnValue(Promise.resolve(expected));

  const user = service.authenticate("some code", "");
  expect(user).toMatchObject(expected);
  expect(mockRepo.create.mock.calls.length).toBe(0);
  expect(mockRepo.getByFeideId.mock.calls.length).toBe(1);
  expect(mockRepo.getByFeideId.mock.calls[0][0]).toBe((await expected).feideId);
});
