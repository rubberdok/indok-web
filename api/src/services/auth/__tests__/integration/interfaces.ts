import { User } from "@prisma/client";
import { FeideResponses } from "../__mocks__/feide";

export interface OAuthCase {
  name: string;
  responses: FeideResponses;
  expected: Pick<User, "email" | "feideId" | "firstName" | "lastName" | "username">;
}
