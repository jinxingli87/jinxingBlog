import { prisma } from "./prisma";

export async function safeDbQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    console.warn("[DB] Query failed, using fallback. Database may not be available.");
    return fallback;
  }
}

export { prisma };
