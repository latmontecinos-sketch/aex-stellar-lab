import Link from "next/link";
import { EntryCard, TaskCard } from "@/components/cards";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { library } from "@/content/library";
import { KINDS, KIND_ORDER, byOrder, site } from "@/content/schema";
import { tasks } from "@/content/tasks";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  const classes = library.filter((e) => e.kind === "clase").sort(byOrder);
  const thisWeek = library
    .filter((e) => e.week === site.currentWeek && e.kind !== "clase")
    .sort((a, b) => b.date.localeCompare(a.date) || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind))
    .slice(0, 6);
  const stats = [
    { value: library.length, label: "Entradas" },
    { value: tasks.length, label: "Tareas" },
    { value: tasks.filter((t) => t.status === "entregado").length, label: "Entregadas" },
    { value: site.currentWeek, label: "Semana" },
  ];

  return (
    <>
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          <span aria-hidden className="h-2 w-2 bg-accent" />
          {site.program} · Semana {site.currentWeek}
        </p>
        <h1 className="mt-6 text-5xl leading-[0.92] font-extrabold uppercase [font-stretch:125%] sm:text-7xl lg:text-8xl">
          Aex
          <br />
          Stellar Lab
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {site.tagline} en Stellar: clases, apuntes, repos y tareas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/biblioteca">Biblioteca</ButtonLink>
          <ButtonLink href="/tareas" variant="secondary">
            Tareas
          </ButtonLink>
        </div>
        <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-4 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl font-bold [font-stretch:112%]">{pad(s.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="secciones" className="pb-16">
        <SectionHeading id="secciones" index="01" title="Secciones" />
        <ul className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {KIND_ORDER.map((kind, i) => (
            <li key={kind} className="bg-surface">
              <Link
                href={`/biblioteca?tipo=${kind}`}
                className="group flex h-full flex-col p-5 transition-colors hover:bg-surface-2"
              >
                <span className="flex items-baseline justify-between gap-3 font-mono text-xs text-muted">
                  <span>{pad(i + 1)}</span>
                  <span className="text-sm text-text">{pad(library.filter((e) => e.kind === kind).length)}</span>
                </span>
                <span className="mt-4 font-display font-bold uppercase [font-stretch:112%] group-hover:text-accent">
                  {KINDS[kind].many}
                </span>
                <span className="mt-1 text-sm text-muted">{KINDS[kind].description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tareas" className="pb-16">
        <SectionHeading id="tareas" index="02" title="Tareas" link={{ href: "/tareas", label: "Ver todas" }} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.slug} task={task} />
          ))}
        </div>
      </section>

      <section aria-labelledby="clases" className="pb-16">
        <SectionHeading
          id="clases"
          index="03"
          title="Clases para repasar"
          link={{ href: "/biblioteca?tipo=clase", label: "Ver todas" }}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section aria-labelledby="esta-semana">
        <SectionHeading
          id="esta-semana"
          index="04"
          title={`Nuevo en la semana ${site.currentWeek}`}
          link={{ href: `/biblioteca?semana=${site.currentWeek}`, label: "Ver la semana" }}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {thisWeek.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  );
}
