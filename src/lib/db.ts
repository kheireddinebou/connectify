import { Redis } from "@upstash/redis";

const getRedisCredentials = () => {
  const redisURl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (
    !redisURl ||
    redisURl.length === 0 ||
    !redisToken ||
    redisToken.length === 0
  ) {
    throw new Error("No Redis Credentials ");
  }

  return { redisToken, redisURl };
};

export const db = new Redis({
  url: getRedisCredentials().redisURl,
  token: getRedisCredentials().redisToken,
});
