"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KINDS, KIND_ORDER, weekRange, type Kind } from "@/content/schema";

/** Lo mínimo para ordenar y filtrar: las tarjetas ya vienen renderizadas desde el servidor. */
export type IndexEntry = {
  id: string;
  kind: Kind;
  week: number;
  date: string;
  order: number;
  title: string;
  session?: string;
  review: boolean;
  text: string;
};

type View = "semana" | "tipo";

type Props = {
  index: IndexEntry[];
  /** Tarjeta de cada entrada, por id, ya ordenadas por sección. */
  cards: Record<string, ReactNode>;
};

type Filters = { view: View; kind: Kind | null; week: number | null };

const GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
const LABEL = "font-mono text-xs uppercase tracking-wider text-muted";

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
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-sm border px-3 font-mono text-xs uppercase tracking-wider transition-colors ${
        active ? "border-accent bg-accent-soft font-medium text-accent" : "border-border bg-surface text-muted hover:text-text"
      }`}
    >
      {children}
      {count !== undefined && <span className="text-xs opacity-70">{count}</span>}
    </button>
  );
}

function Cards({ entries, cards }: { entries: IndexEntry[]; cards: Props["cards"] }) {
  return (
    <div className={GRID}>
      {entries.map((entry) => (
        <div key={entry.id}>{cards[entry.id]}</div>
      ))}
    </div>
  );
}

/**
 * Cada semana, de la más nueva a la más vieja: primero sus clases en orden, después lo que se compartió en
 * cada una y al final el resto, por tipo.
 */
function ByWeek({ index, matches, cards }: { index: IndexEntry[]; matches: IndexEntry[]; cards: Props["cards"] }) {
  const weeks = [...new Set(matches.map((e) => e.week))].sort((a, b) => b - a);
  return (
    <div className="mt-4 flex flex-col gap-16">
      {weeks.map((week) => {
        const inWeek = matches.filter((e) => e.week === week);
        const sessions = index
          .filter((e) => e.kind === "clase" && e.week === week && !e.review)
          .sort((a, b) => a.order - b.order || a.date.localeCompare(b.date));
        const sessionIds = new Set(sessions.map((c) => c.id));
        const classes = sessions.filter((c) => inWeek.includes(c));
        const shared = sessions
          .map((c) => ({ session: c, entries: inWeek.filter((e) => e.session === c.id) }))
          .filter((b) => b.entries.length > 0);
        const rest = inWeek.filter((e) => !sessionIds.has(e.id) && !(e.session && sessionIds.has(e.session)));
        const restByKind = KIND_ORDER.map((k) => ({ kind: k, entries: rest.filter((e) => e.kind === k) })).filter(
          (g) => g.entries.length > 0,
        );
        return (
          <section key={week} id={`semana-${week}`} aria-labelledby={`semana-${week}-titulo`} className="scroll-mt-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
              <h2 id={`semana-${week}-titulo`} className="text-2xl font-bold tracking-tight">
                Semana {week}
              </h2>
              <span className={LABEL}>{weekRange(week)}</span>
              <span className="text-sm text-muted">· {inWeek.length}</span>
            </div>
            <div className="mt-6 flex flex-col gap-10">
              {classes.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-bold">Clases</h3>
                  <Cards entries={classes} cards={cards} />
                </div>
              )}
              {shared.map(({ session, entries }) => (
                <div key={session.id} className="border-l-2 border-accent pl-4 sm:pl-6">
                  <h3 className="mb-4 text-lg font-bold">
                    <span className={`${LABEL} mr-2`}>Compartido en</span>
                    {session.title}
                  </h3>
                  <Cards entries={entries} cards={cards} />
                </div>
              ))}
              {restByKind.length > 0 && (
                <div className="flex flex-col gap-6">
                  {(classes.length > 0 || shared.length > 0) && (
                    <h3 className="text-lg font-bold">Más de esta semana</h3>
                  )}
                  {restByKind.map((group) => (
                    <div key={group.kind}>
                      <p className={`${LABEL} mb-3`}>{KINDS[group.kind].many}</p>
                      <Cards entries={group.entries} cards={cards} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ByKind({ matches, cards }: { matches: IndexEntry[]; cards: Props["cards"] }) {
  const groups = KIND_ORDER.map((k) => ({ kind: k, entries: matches.filter((e) => e.kind === k) })).filter(
    (g) => g.entries.length > 0,
  );
  return (
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
          <div className="mt-5">
            <Cards entries={group.entries} cards={cards} />
          </div>
        </section>
      ))}
    </div>
  );
}

function LibraryView({
  index,
  cards,
  filters,
  onFilter,
}: Props & { filters: Filters; onFilter: (next: Filters) => void }) {
  const { view, kind, week } = filters;
  const [query, setQuery] = useState("");
  const active = useMemo(() => index.filter((e) => !e.review), [index]);
  const weeks = useMemo(() => [...new Set(active.map((e) => e.week))].sort((a, b) => a - b), [active]);
  const kinds = useMemo(() => KIND_ORDER.filter((k) => active.some((e) => e.kind === k)), [active]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return index.filter(
      (e) => (!week || e.week === week) && (!kind || e.kind === kind) && (!q || normalize(e.text).includes(q)),
    );
  }, [index, kind, week, query]);
  const matches = filtered.filter((e) => !e.review);
  const inReview = filtered.filter((e) => e.review);
  // Los contadores de tipo ignoran el filtro de tipo, y los de semana el de semana.
  const countKind = (k: Kind) => active.filter((e) => e.kind === k && (!week || e.week === week)).length;
  const countWeek = (w: number) => active.filter((e) => e.week === w && (!kind || e.kind === kind)).length;

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Ordenar" className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Ver:</span>
            <Chip active={view === "semana"} onClick={() => onFilter({ ...filters, view: "semana" })}>
              Por semana
            </Chip>
            <Chip active={view === "tipo"} onClick={() => onFilter({ ...filters, view: "tipo" })}>
              Por tipo
            </Chip>
          </div>
          <label className="relative block lg:w-72 lg:shrink-0">
            <span className="sr-only">Buscar en la biblioteca</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: soroban, escrow, mcp…"
              className="h-10 w-full rounded-sm border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
          </label>
        </div>
        <div role="group" aria-label="Filtrar por semana" className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Semana:</span>
          <Chip active={week === null} onClick={() => onFilter({ ...filters, week: null })}>
            Todas
          </Chip>
          {weeks.map((w) => (
            <Chip key={w} active={week === w} onClick={() => onFilter({ ...filters, week: w })} count={countWeek(w)}>
              {w}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Tipo:</span>
          <Chip active={kind === null} onClick={() => onFilter({ ...filters, kind: null })}>
            Todo
          </Chip>
          {kinds.map((k) => (
            <Chip key={k} active={kind === k} onClick={() => onFilter({ ...filters, kind: k })} count={countKind(k)}>
              {KINDS[k].many}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {matches.length === 1 ? "1 entrada" : `${matches.length} entradas`}
      </p>

      {matches.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-border bg-surface p-6 text-muted">
          No hay nada con esos filtros. Prueba con otra palabra, otra semana o quita el filtro.
        </p>
      ) : view === "semana" ? (
        <ByWeek index={index} matches={matches} cards={cards} />
      ) : (
        <ByKind matches={matches} cards={cards} />
      )}

      {inReview.length > 0 && (
        <details className="group mt-16 border-t border-border pt-6">
          <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              <span aria-hidden className="mr-2 inline-block font-mono text-accent group-open:rotate-90">
                ›
              </span>
              En revisión
            </h2>
            <span className="text-sm text-muted">{inReview.length}</span>
            <p className="w-full text-sm text-muted">
              Lo que quizás ya no sirve. Cada tarjeta dice por qué; las reviso y decido si quedan o salen.
            </p>
          </summary>
          <div className="mt-5">
            <Cards entries={inReview} cards={cards} />
          </div>
        </details>
      )}
    </div>
  );
}

/** Los filtros viven en la URL (`?vista=&tipo=&semana=`), así se pueden compartir y el menú los reinicia. */
function LibraryFromUrl(props: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tipo = params.get("tipo");
  const semana = Number(params.get("semana"));
  const filters: Filters = {
    view: params.get("vista") === "tipo" ? "tipo" : "semana",
    kind: KIND_ORDER.find((k) => k === tipo) ?? null,
    week: props.index.some((e) => e.week === semana) ? semana : null,
  };

  const onFilter = ({ view, kind, week }: Filters) => {
    const next = new URLSearchParams();
    if (view === "tipo") next.set("vista", "tipo");
    if (kind) next.set("tipo", kind);
    if (week) next.set("semana", String(week));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return <LibraryView {...props} filters={filters} onFilter={onFilter} />;
}

export function LibraryBrowser(props: Props) {
  // Mientras se leen los filtros de la URL (y en el HTML estático) se ve todo, por semana.
  return (
    <Suspense fallback={<LibraryView {...props} filters={{ view: "semana", kind: null, week: null }} onFilter={() => {}} />}>
      <LibraryFromUrl {...props} />
    </Suspense>
  );
}
