const publicKeyPem =
  process.env.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY?.replace(/\\n/g, "\n") ?? "";

function pemToArrayBuffer(pem: string, type: "public" | "private") {
  const b64 = pem
    .replace(
      type === "public"
        ? /-----BEGIN PUBLIC KEY-----/
        : /-----BEGIN PRIVATE KEY-----/,
      "",
    )
    .replace(
      type === "public"
        ? /-----END PUBLIC KEY-----/
        : /-----END PRIVATE KEY-----/,
      "",
    )
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptPassword(password: string): Promise<string> {
  if (!publicKeyPem) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY não configurada");
  }

  const key = await crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(publicKeyPem, "public"),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    new TextEncoder().encode(password),
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptPassword(
  encryptedBase64: string,
  privateKeyPem: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(
      privateKeyPem.replace(/\\n/g, "\n"),
      "private",
    ),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"],
  );

  const encrypted = Uint8Array.from(atob(encryptedBase64), (c) =>
    c.charCodeAt(0),
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    encrypted,
  );

  return new TextDecoder().decode(decrypted);
}
