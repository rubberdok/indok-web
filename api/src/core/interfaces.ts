import { PrismaClient } from "@prisma/client";
import { ServerClient } from "postmark";

export interface Database extends PrismaClient {}
export interface IMailClient extends ServerClient {}
