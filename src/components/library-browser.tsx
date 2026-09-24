"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KINDS, KIND_ORDER, type Kind } from "@/content/schema";

/** Lo mínimo para filtrar: las tarjetas ya vienen renderizadas desde el servidor. */
export type IndexEntry = { id: string; kind: Kind; week: number; text: string };

type Props = {
  index: IndexEntry[];
  /** Tarjeta de cada entrada, por id, ya ordenadas dentro de su sección. */
  cards: Record<string, ReactNode>;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
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

function LibraryView({
  index,
  cards,
  kind,
  week,
  onFilter,
}: Props & {
  kind: Kind | null;
  week: number | null;
  onFilter: (kind: Kind | null, week: number | null) => void;
}) {
  const [query, setQuery] = useState("");
  const weeks = useMemo(() => [...new Set(index.map((e) => e.week))].sort((a, b) => a - b), [index]);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    return index.filter((e) => (!week || e.week === week) && (!q || normalize(e.text).includes(q)));
  }, [index, week, query]);

  const groups = KIND_ORDER.filter((k) => !kind || k === kind)
    .map((k) => ({ kind: k, entries: matches.filter((e) => e.kind === k) }))
    .filter((g) => g.entries.length > 0);
  const total = groups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrar por sección" className="flex flex-wrap gap-2">
            <Chip active={kind === null} onClick={() => onFilter(null, week)} count={matches.length}>
              Todo
            </Chip>
            {KIND_ORDER.map((k) => (
              <Chip
                key={k}
                active={kind === k}
                onClick={() => onFilter(k, week)}
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
          <Chip active={week === null} onClick={() => onFilter(kind, null)} count={index.length}>
            Todas
          </Chip>
          {weeks.map((w) => (
            <Chip key={w} active={week === w} onClick={() => onFilter(kind, w)} count={index.filter((e) => e.week === w).length}>
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
                  <div key={entry.id}>{cards[entry.id]}</div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/** Los filtros viven en la URL (`?tipo=&semana=`), así se pueden compartir y el menú los reinicia. */
function LibraryFromUrl(props: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tipo = params.get("tipo");
  const kind = KIND_ORDER.includes(tipo as Kind) ? (tipo as Kind) : null;
  const semana = Number(params.get("semana"));
  const week = props.index.some((e) => e.week === semana) ? semana : null;

  const onFilter = (nextKind: Kind | null, nextWeek: number | null) => {
    const next = new URLSearchParams();
    if (nextKind) next.set("tipo", nextKind);
    if (nextWeek) next.set("semana", String(nextWeek));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return <LibraryView {...props} kind={kind} week={week} onFilter={onFilter} />;
}

export function LibraryBrowser(props: Props) {
  // Mientras se leen los filtros de la URL (y en el HTML estático) se ve todo.
  return (
    <Suspense fallback={<LibraryView {...props} kind={null} week={null} onFilter={() => {}} />}>
      <LibraryFromUrl {...props} />
    </Suspense>
  );
}
