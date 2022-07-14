import { PrismaClient, pkce } from ".prisma/client";

export const authRepository = (db: PrismaClient) => {
  return {
    addCodeVerifier: (codeVerifier: string): Promise<pkce> => {
      return db.pkce.create({
        data: {
          codeVerifier,
        },
      });
    },
    retrieveCodeVerifier: (id: string): Promise<pkce> => {
      return db.pkce.delete({
        where: {
          id,
        },
      });
    },
  };
};

export type AuthRepository = ReturnType<typeof authRepository>;
