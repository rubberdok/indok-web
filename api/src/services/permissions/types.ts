import { Prisma } from "@prisma/client";

type Entity = Lowercase<Prisma.ModelName>;
type Scope = "read" | "write";
type Identifier = string;

export type PermissionString = `${Scope}:${Entity}:${Identifier}` | `${Scope}:${Entity}`;
