import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { stashes } from "@/db/schema";
import { formatCoordinates } from "@/lib/coordinates";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await db.select().from(stashes).orderBy(desc(stashes.createdAt));

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HamsterCheek</h1>
          <p className="text-sm text-muted-foreground">Your stashes, off the grid.</p>
        </div>
        <Link
          href="/new"
          className="rounded-[var(--radius-token)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Add a stash
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[var(--radius-token)] border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No stashes yet. Add your first one to remember where it&apos;s hidden.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/stashes/${item.id}`}
                className="flex items-center justify-between gap-4 rounded-[var(--radius-token)] border border-border bg-card px-4 py-3 hover:border-primary"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCoordinates({ lat: item.lat, lng: item.lng })}
                  </p>
                </div>
                {item.photoUrl && (
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-token)] border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.photoUrl} alt="" className="h-full w-full object-cover" />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
