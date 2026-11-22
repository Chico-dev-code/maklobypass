import { redis, BOTS } from "../lib/db.js";
import crypto from "node:crypto";
import { safeEqual, sha256 } from "../lib/crypto.js";

const isAdmin = (req) =>
  !!process.env.ADMIN_KEY &&
  safeEqual(req.headers["x-admin-key"] || "", process.env.ADMIN_KEY);

// ID bot = angka sebelum ":" pada token. Kirim angkanya saja.
const cleanId = (v) => {
  const id = String(v ?? "").trim();
  return /^\d{5,15}$/.test(id) ? id : null;
};

async function main(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  // LIST
  if (req.method === "GET") {
    const all = (await redis.hgetall(BOTS)) || {};
    const bots = Object.entries(all).map(([id, v]) => ({ id, label: v.label, addedAt: v.addedAt }));
    return res.json({ count: bots.length, bots });
  }

  // ADD
  if (req.method === "POST") {
    const id = cleanId(req.body?.id);
    if (!id) return res.status(400).json({ error: "id harus angka sebelum ':'" });
    // Access key dibuat acak, hanya hash-nya yang disimpan. Ditampilkan SEKALI di response ini.
    // Menambah ID yang sama = membuat key baru (key lama otomatis mati).
    const accessKey = crypto.randomBytes(24).toString("hex");
    await redis.hset(BOTS, {
      [id]: { label: String(req.body?.label || ""), addedAt: Date.now(), keyHash: sha256(accessKey) },
    });
    return res.status(201).json({ ok: true, id, accessKey });
  }

  // DELETE
  if (req.method === "DELETE") {
    const id = cleanId(req.query?.id ?? req.body?.id);
    if (!id) return res.status(400).json({ error: "id tidak valid" });
    const removed = await redis.hdel(BOTS, id);
    return res.json({ ok: true, id, removed: removed === 1 });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).end();
}

export default async function handler(req, res) {
  try {
    return await main(req, res);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e).slice(0, 200) });
  }
}
