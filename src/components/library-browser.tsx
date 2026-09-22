"use client";

import { useMemo, useState } from "react";
import { EntryCard } from "@/components/cards";
import { KINDS, KIND_ORDER, byOrder, library, type Kind } from "@/content/lab";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const WEEKS = [...new Set(library.map((e) => e.week))].sort((a, b) => a - b);

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm transition-colors ${
        active ? "border-accent bg-accent-soft font-medium text-accent" : "border-border bg-surface text-muted hover:text-text"
      }`}
    >
      {children}
      <span className="text-xs opacity-70">{count}</span>
    </button>
  );
}

export function LibraryBrowser({
  initialKind,
  initialWeek,
}: {
  initialKind: Kind | null;
  initialWeek: number | null;
}) {
  const [kind, setKind] = useState<Kind | null>(initialKind);
  const [week, setWeek] = useState<number | null>(initialWeek);
  const [query, setQuery] = useState("");

  const sync = (nextKind: Kind | null, nextWeek: number | null) => {
    // La URL refleja los filtros para poder compartirlos.
    const params = new URLSearchParams();
    if (nextKind) params.set("tipo", nextKind);
    if (nextWeek) params.set("semana", String(nextWeek));
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/biblioteca?${qs}` : "/biblioteca");
  };
  const selectKind = (next: Kind | null) => {
    setKind(next);
    sync(next, week);
  };
  const selectWeek = (next: number | null) => {
    setWeek(next);
    sync(kind, next);
  };

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    return library.filter(
      (e) =>
        (!week || e.week === week) &&
        (!q || normalize([e.title, e.summary, e.author ?? "", ...e.tags].join(" ")).includes(q)),
    );
  }, [week, query]);

  const groups = KIND_ORDER.filter((k) => !kind || k === kind)
    .map((k) => ({ kind: k, entries: matches.filter((e) => e.kind === k).sort(byOrder) }))
    .filter((g) => g.entries.length > 0);
  const total = groups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrar por sección" className="flex flex-wrap gap-2">
            <Chip active={kind === null} onClick={() => selectKind(null)} count={matches.length}>
              Todo
            </Chip>
            {KIND_ORDER.map((k) => (
              <Chip
                key={k}
                active={kind === k}
                onClick={() => selectKind(k)}
                count={matches.filter((e) => e.kind === k).length}
              >
                {KINDS[k].many}
              </Chip>
            ))}
          </div>
          <label className="relative block lg:w-72 lg:shrink-0">
            <span className="sr-only">Buscar en la biblioteca</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: soroban, escrow, clase…"
              className="h-10 w-full rounded-full border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
          </label>
        </div>
        <div role="group" aria-label="Filtrar por semana" className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Semana:</span>
          <Chip active={week === null} onClick={() => selectWeek(null)} count={library.length}>
            Todas
          </Chip>
          {WEEKS.map((w) => (
            <Chip
              key={w}
              active={week === w}
              onClick={() => selectWeek(w)}
              count={library.filter((e) => e.week === w).length}
            >
              {w}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {total === 1 ? "1 entrada" : `${total} entradas`}
      </p>

      {total === 0 ? (
        <p className="mt-4 rounded-2xl border border-border bg-surface p-6 text-muted">
          No hay nada con esos filtros. Prueba con otra palabra, otra semana o quita el filtro.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.kind} id={group.kind} aria-labelledby={`${group.kind}-titulo`} className="scroll-mt-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
                <h2 id={`${group.kind}-titulo`} className="text-xl font-bold tracking-tight">
                  {KINDS[group.kind].many}
                </h2>
                <span className="text-sm text-muted">{group.entries.length}</span>
                <p className="w-full text-sm text-muted">{KINDS[group.kind].description}</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.entries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
