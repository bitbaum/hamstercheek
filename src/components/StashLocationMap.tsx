"use client";

import dynamic from "next/dynamic";
import type { Coordinates } from "@/lib/coordinates";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-[var(--radius-token)] border border-border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function StashLocationMap({ coords }: { coords: Coordinates }) {
  return <MapPicker value={coords} readOnly />;
}
