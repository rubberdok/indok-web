import { User } from "@prisma/client";
import { UserInfo } from "../../interfaces";

export interface OAuthCase {
  name: string;
  responses: {
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
  };
  expected: User;
}
