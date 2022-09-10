import { User } from "@prisma/client";

import { FeideResponses } from "@/services/auth/__tests__/__mocks__/feide";

export interface OAuthCase {
  name: string;
  responses: FeideResponses;
  expected: User;
}
