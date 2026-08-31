"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createStash } from "@/app/actions";
import type { Coordinates } from "@/lib/coordinates";
import { formatCoordinates } from "@/lib/coordinates";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-[var(--radius-token)] border border-border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function NewStashPage() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [state, formAction, isPending] = useActionState(createStash, {});

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add a stash</h1>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Backyard cache box"
            className="rounded-[var(--radius-token)] border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="What's stored here, and any notes on finding it"
            className="rounded-[var(--radius-token)] border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Location</span>
          <p className="text-xs text-muted-foreground">
            Click the map to drop a pin where the box is buried or hidden.
          </p>
          <MapPicker value={coords} onChange={setCoords} />
          <p className="text-xs text-muted-foreground">
            {coords ? formatCoordinates(coords) : "No location selected yet"}
          </p>
          <input type="hidden" name="lat" value={coords?.lat ?? ""} />
          <input type="hidden" name="lng" value={coords?.lng ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="photo" className="text-sm font-medium">
            Photo (optional)
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="text-sm"
          />
        </div>

        {state.error && (
          <p className="rounded-[var(--radius-token)] border border-danger bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !coords}
          className="rounded-[var(--radius-token)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save stash"}
        </button>
      </form>
    </main>
  );
}
