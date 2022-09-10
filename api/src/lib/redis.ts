import { default as _RedisStore } from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

import { env } from "@/config";

export const RedisStore = _RedisStore(session);
export const redisClient = createClient({
  legacyMode: true,
  url: env.REDIS_URL,
});
redisClient.connect().catch(console.error);
