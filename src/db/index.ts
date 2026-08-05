import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Force .env.local to win over any DATABASE_URL already present in the process
// environment (e.g. a host-level default injected by the dev sandbox) — this app
// must only ever talk to its own database.
config({ path: ".env.local", override: true });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
}

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });
