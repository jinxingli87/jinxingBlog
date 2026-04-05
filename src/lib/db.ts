import { supabase } from "./supabase";

export async function safeDbQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    console.warn("[DB] Query failed, using fallback.");
    return fallback;
  }
}

export { supabase };
