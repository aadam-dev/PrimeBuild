import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DATABASE_URL;

export const sql = connectionString ? neon(connectionString) : null;
export const db = sql ? drizzle(sql) : null;

export function isDbConfigured(): boolean {
  return Boolean(connectionString);
}
