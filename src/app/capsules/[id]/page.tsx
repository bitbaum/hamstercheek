import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { capsules } from "@/db/schema";
import { formatCoordinates } from "@/lib/coordinates";
import CapsuleLocationMap from "@/components/CapsuleLocationMap";
import DeleteCapsuleButton from "@/components/DeleteCapsuleButton";

export default async function CapsuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const capsuleId = Number(id);

  if (!Number.isInteger(capsuleId)) {
    notFound();
  }

  const [capsule] = await db.select().from(capsules).where(eq(capsules.id, capsuleId));

  if (!capsule) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; All capsules
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{capsule.name}</h1>
          <p className="text-sm text-muted-foreground">
            {formatCoordinates({ lat: capsule.lat, lng: capsule.lng })}
          </p>
        </div>
        <DeleteCapsuleButton id={capsule.id} name={capsule.name} />
      </div>

      {capsule.description && <p className="text-sm">{capsule.description}</p>}

      {capsule.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={capsule.photoUrl}
          alt={capsule.name}
          className="max-h-96 w-full rounded-[var(--radius-token)] border border-border object-cover"
        />
      )}

      <CapsuleLocationMap coords={{ lat: capsule.lat, lng: capsule.lng }} />
    </main>
  );
}
