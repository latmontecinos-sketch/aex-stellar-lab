"use client";

import { useMemo, useState } from "react";
import { EntryCard } from "@/components/cards";
import { KIND_LABELS, KIND_ORDER, library, type Kind } from "@/content/lab";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function LibraryBrowser({ initialKind }: { initialKind: Kind | null }) {
  const [kind, setKind] = useState<Kind | null>(initialKind);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return library
      .filter((e) => !kind || e.kind === kind)
      .filter(
        (e) => !q || normalize([e.title, e.summary, ...e.tags].join(" ")).includes(q),
      )
      .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || b.date.localeCompare(a.date));
  }, [kind, query]);

  const selectKind = (next: Kind | null) => {
    setKind(next);
    // La URL refleja el filtro para poder compartirlo.
    const url = next ? `/biblioteca?tipo=${next}` : "/biblioteca";
    window.history.replaceState(null, "", url);
  };

  const chips: { value: Kind | null; label: string; count: number }[] = [
    { value: null, label: "Todo", count: library.length },
    ...KIND_ORDER.map((k) => ({
      value: k,
      label: KIND_LABELS[k].many,
      count: library.filter((e) => e.kind === k).length,
    })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => selectKind(chip.value)}
              aria-pressed={kind === chip.value}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${
                kind === chip.value
                  ? "border-accent bg-accent-soft font-medium text-accent"
                  : "border-border bg-surface text-muted hover:text-text"
              }`}
            >
              {chip.label}
              <span className="text-xs opacity-70">{chip.count}</span>
            </button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Buscar en la biblioteca</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: soroban, cli, renta…"
            className="h-10 w-full rounded-full border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </label>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {results.length === 1 ? "1 entrada" : `${results.length} entradas`}
      </p>
      {results.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-border bg-surface p-6 text-muted">
          No hay nada con esa búsqueda. Prueba con otra palabra o quita el filtro.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
