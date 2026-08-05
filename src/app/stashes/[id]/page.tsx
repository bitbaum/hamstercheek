import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { stashes } from "@/db/schema";
import { formatCoordinates } from "@/lib/coordinates";
import StashLocationMap from "@/components/StashLocationMap";

export default async function StashDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stashId = Number(id);

  if (!Number.isInteger(stashId)) {
    notFound();
  }

  const [stash] = await db.select().from(stashes).where(eq(stashes.id, stashId));

  if (!stash) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; All stashes
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{stash.name}</h1>
        <p className="text-sm text-muted-foreground">{formatCoordinates({ lat: stash.lat, lng: stash.lng })}</p>
      </div>

      {stash.description && <p className="text-sm">{stash.description}</p>}

      {stash.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={stash.photoUrl}
          alt={stash.name}
          className="max-h-96 w-full rounded-[var(--radius-token)] border border-border object-cover"
        />
      )}

      <StashLocationMap coords={{ lat: stash.lat, lng: stash.lng }} />
    </main>
  );
}
