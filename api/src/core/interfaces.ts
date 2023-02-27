import { PrismaClient } from "@prisma/client";
import { Session, SessionData } from "express-session";
import { ServerClient } from "postmark";

export interface Database extends PrismaClient {}
export interface IMailClient extends ServerClient {}

export interface ISessionContext {
  session: Session & Partial<SessionData>;
}

declare module "express-session" {
  interface SessionData {
    userId: string | null;
    codeVerifier: string;
  }
}
