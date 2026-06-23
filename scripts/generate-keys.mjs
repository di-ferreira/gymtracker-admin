import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const envPath = path.resolve(__dirname, "..", ".env");
let envContent = "";
try {
  envContent = fs.readFileSync(envPath, "utf-8");
} catch {
  // file doesn't exist yet
}

function upsertEnv(key, value) {
  const re = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;
  if (re.test(envContent)) {
    envContent = envContent.replace(re, line);
  } else {
    envContent += (envContent.endsWith("\n") ? "" : "\n") + line + "\n";
  }
}

const pubKeyOneLine = publicKey.replace(/\n/g, "\\n");
const privKeyOneLine = privateKey.replace(/\n/g, "\\n");

upsertEnv("NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY", pubKeyOneLine);
upsertEnv("ENCRYPTION_PRIVATE_KEY", privKeyOneLine);

if (!/^API_URL=/.test(envContent)) {
  upsertEnv("API_URL", "http://localhost:8001/api/v1");
}

fs.writeFileSync(envPath, envContent.trimEnd() + "\n");
console.log("Chaves RSA geradas e salvas em .env");
