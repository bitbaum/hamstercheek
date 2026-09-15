import { pgTable, serial, text, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const capsules = pgTable("capsules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Capsule = typeof capsules.$inferSelect;
export type NewCapsule = typeof capsules.$inferInsert;
