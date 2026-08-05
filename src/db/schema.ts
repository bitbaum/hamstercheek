import { pgTable, serial, text, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const stashes = pgTable("stashes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Stash = typeof stashes.$inferSelect;
export type NewStash = typeof stashes.$inferInsert;
