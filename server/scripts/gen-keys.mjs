// Jalankan sekali: node server/scripts/gen-keys.mjs
import crypto from "node:crypto";
const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
console.log("SIGN_PRIVATE_KEY (taruh di env Vercel, RAHASIA):");
console.log(privateKey.export({ type: "pkcs8", format: "der" }).toString("base64"));
console.log("\nPUBLIC_KEY (taruh di .env bot client, boleh dibagikan):");
console.log(publicKey.export({ type: "spki", format: "der" }).toString("base64"));
