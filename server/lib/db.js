import { Redis } from "@upstash/redis";

// Membaca UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv();

// Hash "bots": field = ID bot (angka sebelum ":"), value = { label, addedAt }
export const BOTS = "bots";
