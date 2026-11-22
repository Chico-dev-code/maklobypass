import { Redis } from "@upstash/redis";

const e = process.env;
// Mendukung nama variabel Upstash maupun Vercel KV
export const redis = new Redis({
  url: e.UPSTASH_REDIS_REST_URL || e.KV_REST_API_URL,
  token: e.UPSTASH_REDIS_REST_TOKEN || e.KV_REST_API_TOKEN,
});

// Hash "bots": field = ID bot, value = { label, addedAt, keyHash }
export const BOTS = "bots";
