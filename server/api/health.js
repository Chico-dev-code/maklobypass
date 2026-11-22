// Hanya menampilkan ada/tidaknya variabel, bukan isinya
export default function handler(req, res) {
  const e = process.env;
  res.json({
    ADMIN_KEY: !!e.ADMIN_KEY,
    SIGN_PRIVATE_KEY: !!e.SIGN_PRIVATE_KEY,
    REDIS_URL: !!(e.UPSTASH_REDIS_REST_URL || e.KV_REST_API_URL),
    REDIS_TOKEN: !!(e.UPSTASH_REDIS_REST_TOKEN || e.KV_REST_API_TOKEN),
  });
}
