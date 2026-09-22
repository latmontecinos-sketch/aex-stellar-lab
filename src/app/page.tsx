import Link from "next/link";
import { EntryCard, TaskCard } from "@/components/cards";
import { KIND_LABELS, KIND_ORDER, library, site, tasks } from "@/content/lab";

export default function Home() {
  const latest = [...library].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const counts = KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_LABELS[kind].many,
    count: library.filter((e) => e.kind === kind).length,
  }));

  return (
    <>
      <section className="py-12 sm:py-16">
        <p className="text-sm font-medium text-accent">{site.program}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {site.tagline} en Stellar: los repositorios que construyo, mis apuntes, los recursos que uso y las
          tareas del programa, cada una con su ejecución y su explicación.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {counts.map((c) => (
            <li key={c.kind}>
              <Link
                href={`/biblioteca?tipo=${c.kind}`}
                className="block rounded-2xl border border-border bg-surface px-4 py-3 hover:border-accent"
              >
                <span className="block text-2xl font-bold">{c.count}</span>
                <span className="text-sm text-muted">{c.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/tareas"
              className="block rounded-2xl border border-border bg-surface px-4 py-3 hover:border-accent"
            >
              <span className="block text-2xl font-bold">{tasks.length}</span>
              <span className="text-sm text-muted">{tasks.length === 1 ? "Tarea" : "Tareas"}</span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="tareas" className="pb-12">
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

      <section aria-labelledby="recientes">
        <div className="flex items-end justify-between gap-4">
          <h2 id="recientes" className="text-2xl font-bold tracking-tight">
            Lo último en la biblioteca
          </h2>
          <Link href="/biblioteca" className="text-sm font-medium text-accent hover:underline">
            Ver la biblioteca →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {latest.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  );
}
