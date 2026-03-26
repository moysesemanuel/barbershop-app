import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const hashedBuffer = Buffer.from(hash, "hex");
  const suppliedBuffer = scryptSync(password, salt, KEY_LENGTH);

  if (hashedBuffer.length !== suppliedBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashedBuffer, suppliedBuffer);
}
