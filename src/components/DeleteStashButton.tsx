"use client";

import { deleteStash } from "@/app/actions";

export default function DeleteStashButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteStash.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="shrink-0 rounded-[var(--radius-token)] border border-danger px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}
