import crypto from "node:crypto";

export const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

let privateKey;
// Tanda tangan Ed25519 dengan private key yang hanya ada di server
export function signResponse(data) {
  privateKey ??= crypto.createPrivateKey({
    key: Buffer.from(process.env.SIGN_PRIVATE_KEY || "", "base64"),
    format: "der",
    type: "pkcs8",
  });
  return crypto.sign(null, Buffer.from(data), privateKey).toString("base64");
}
