import Link from "next/link";
import { EntryCard, TaskCard } from "@/components/cards";
import { library } from "@/content/library";
import { KINDS, KIND_ORDER, byOrder, site } from "@/content/schema";
import { tasks } from "@/content/tasks";

export default function Home() {
  const classes = library.filter((e) => e.kind === "clase").sort(byOrder);
  const thisWeek = library
    .filter((e) => e.week === site.currentWeek && e.kind !== "clase")
    .sort((a, b) => b.date.localeCompare(a.date) || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind))
    .slice(0, 6);

  return (
    <>
      <section className="py-12 sm:py-16">
        <p className="text-sm font-medium text-accent">
          {site.program} · Semana {site.currentWeek}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {site.tagline} en Stellar: las clases, mis apuntes, la documentación, los repositorios y todo lo que
          comparten en el programa, ordenado por secciones. Y las tareas, cada una con su ejecución y su
          explicación.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/biblioteca"
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 font-medium text-surface hover:opacity-90"
          >
            Abrir la biblioteca
          </Link>
          <Link
            href="/tareas"
            className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-6 font-medium hover:border-accent hover:text-accent"
          >
            Ver las tareas
          </Link>
        </div>
      </section>

      <section aria-labelledby="secciones" className="pb-14">
        <h2 id="secciones" className="text-2xl font-bold tracking-tight">
          Secciones
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KIND_ORDER.map((kind) => (
            <li key={kind}>
              <Link
                href={`/biblioteca?tipo=${kind}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold group-hover:text-accent">{KINDS[kind].many}</span>
                  <span className="text-2xl font-bold">{library.filter((e) => e.kind === kind).length}</span>
                </span>
                <span className="mt-1 text-sm text-muted">{KINDS[kind].description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="clases" className="pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 id="clases" className="text-2xl font-bold tracking-tight">
            Clases para repasar
          </h2>
          <Link href="/biblioteca?tipo=clase" className="text-sm font-medium text-accent hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section aria-labelledby="tareas" className="pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 id="tareas" className="text-2xl font-bold tracking-tight">
            Tareas
          </h2>
          <Link href="/tareas" className="text-sm font-medium text-accent hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.slug} task={task} />
          ))}
        </div>
      </section>

      <section aria-labelledby="esta-semana">
        <div className="flex items-end justify-between gap-4">
          <h2 id="esta-semana" className="text-2xl font-bold tracking-tight">
            Nuevo en la semana {site.currentWeek}
          </h2>
          <Link
            href={`/biblioteca?semana=${site.currentWeek}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            Ver toda la semana →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {thisWeek.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  );
}
