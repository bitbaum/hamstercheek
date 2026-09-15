# Zeitkastli

A weatherproof capsule and a web app that remembers where you put it.

Zeitkastli is a time capsule you can actually find again. Put something in the
box — a letter to your kids, a photo, a keepsake, the thing you want someone to
open in ten years — leave it somewhere that means something, and drop a pin.
The app keeps the coordinates, a photo of the spot and your notes, so the
location outlives your memory of it.

> _Zeitkastli_ is Swiss German for "little time box" (`Kästli`, the diminutive of
> `Kasten`). Say ZYTE-kast-lee.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions)
- Postgres via [Drizzle ORM](https://orm.drizzle.team)
- [Leaflet](https://leafletjs.com) + OpenStreetMap for the map picker (no API key needed)
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript, Vitest

## Get started

```bash
git clone <this-repo-url>
cd zeitkastli
pnpm install
cp .env.example .env.local   # fill in DATABASE_URL
pnpm run db:generate          # generate SQL migrations from src/db/schema.ts
pnpm run db:migrate           # apply them
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's here

```
src/
├── app/
│   ├── page.tsx               ← home: list of capsules
│   ├── new/page.tsx           ← add-a-capsule form (map picker + photo upload)
│   ├── capsules/[id]/page.tsx ← capsule detail
│   └── actions.ts             ← server action: create a capsule
├── components/
│   ├── MapPicker.tsx          ← click-to-drop-pin Leaflet map
│   └── CapsuleLocationMap.tsx ← read-only map for the detail page
├── db/
│   ├── schema.ts              ← the `capsules` table (Drizzle)
│   ├── index.ts               ← DB client
│   └── migrate.ts             ← runs drizzle/*.sql against DATABASE_URL
└── lib/coordinates.ts         ← lat/lng validation + formatting
```

Uploaded photos are saved to `public/uploads/` on disk — fine for a single-server
deployment, not for anything horizontally scaled or ephemeral-filesystem hosted.

## What's next

- Auth: `pnpm add next-auth@beta` + scope capsules to a user
- An **open-on** date per capsule, and the person it is meant for
- Move photo storage to an object store (S3, R2) instead of local disk
- Deploy: self-host behind a reverse proxy (build, then run `next start` on your server)

## What this is not

Zeitkastli records where you left something so you or the person you name can
find it later. It is not a tool for concealing assets, and it is not private
storage: coordinates you save are stored in plain text in the database, so do
not use it for anything you would not want an administrator or a court to read.

## Need help?

Open this project in FleetCrown's Control panel to dispatch AI agents at it.
