import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import repository, { Repository } from "./repository";
import service, { Service } from "./services";

export type Context = {
  repository: Repository;
  service: Service;
};

export type MockContext = Context & {
  /* We expose the DB for the mock context for testability */
  db: DeepMockProxy<PrismaClient>;
};

let _db: PrismaClient;

/**
 * If we have a cached db client, return it, otherwise, initialize a new DB client
 */
export const initializeDB = (): PrismaClient => {
  if (_db) return _db;
  _db = new PrismaClient();
  return _db;
};

const context = (db: PrismaClient): Context => {
  const repo = repository(db);
  return {
    repository: repo,
    service: service(repo),
  };
};

export const createMockContext = (): MockContext => {
  const mockDb = mockDeep<PrismaClient>();
  const ctx = context(mockDb);
  const mockCtx = { ...ctx, db: mockDb };
  return mockCtx;
};

export default context;
