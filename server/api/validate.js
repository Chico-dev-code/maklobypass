import { redis, BOTS } from "../lib/db.js";
import { sha256, safeEqual, signResponse } from "../lib/crypto.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const botId = String(req.headers["x-bot-id"] || "");
  const key = String(req.headers["x-access-key"] || "");
  const ts = String(req.headers["x-timestamp"] || "");
  const nonce = String(req.headers["x-nonce"] || "");

  if (
    !/^\d{5,15}$/.test(botId) ||
    !/^[a-f0-9]{16,64}$/.test(nonce) ||
    !/^\d{10,15}$/.test(ts) ||
    !key || key.length > 128
  ) {
    return res.status(400).json({ error: "bad_request" });
  }

  // ID terdaftar DAN access key cocok dengan hash yang tersimpan
  const rec = await redis.hget(BOTS, botId);
  const valid = !!rec?.keyHash && safeEqual(sha256(key), rec.keyHash);

  // Response ditandatangani private key server; client memverifikasi dengan public key.
  // Nonce & timestamp milik client ikut ditandatangani, jadi response lama tidak bisa dipakai ulang.
  let signature;
  try {
    signature = signResponse(`${valid}.${botId}.${nonce}.${ts}`);
  } catch {
    return res.status(500).json({ error: "server_not_configured" });
  }
  return res.json({ valid, botId, nonce, ts, signature });
}
