import type { Metadata } from "next";
import Link from "next/link";
import { SmartLink } from "@/components/ui";
import { notesFor } from "@/content/class-notes";
import { guide, resourcesOf } from "@/content/guide";
import { KINDS, weekRange, type Entry } from "@/content/schema";
import { taskBySlug } from "@/content/tasks";

export const metadata: Metadata = {
  title: "Guía",
  description: "Cómo construir en Stellar semana a semana: qué hacer y qué recursos usar en cada paso.",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Una fila por recurso: qué es, qué hace y dónde abrirlo. */
function Resource({ entry }: { entry: Entry }) {
  const link = notesFor(entry.id) ? { label: "Apuntes", href: `/biblioteca/clase/${entry.id}` } : entry.links[0];
  return (
    <li className="grid gap-x-4 gap-y-1 bg-surface px-4 py-3 sm:grid-cols-[7.5rem_1fr_auto] sm:items-baseline">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{KINDS[entry.kind].one}</span>
      <div>
        <p className="font-medium">{entry.title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{entry.summary}</p>
      </div>
      {link && (
        <SmartLink href={link.href} className="text-sm font-medium whitespace-nowrap text-accent underline underline-offset-4">
          {link.label}
        </SmartLink>
      )}
    </li>
  );
}

export default function GuiaPage() {
  return (
    <>
      <section className="pt-14 pb-10 sm:pt-20 sm:pb-12">
        <h1 className="text-4xl leading-none font-extrabold uppercase [font-stretch:120%] sm:text-6xl">Guía</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Cómo construir en Stellar semana a semana: qué lograr, qué hacer y qué recursos usar en cada paso. Sale de
          las clases del programa y de lo que fui probando.
        </p>
        <nav aria-label="Semanas de la guía" className="mt-8">
          <ol className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-5">
            {guide.map((step) => (
              <li key={step.week} className="bg-surface">
                <a href={`#semana-${step.week}`} className="group block h-full p-4 transition-colors hover:bg-surface-2">
                  <span className="font-mono text-xs text-accent">Semana {pad(step.week)}</span>
                  <span className="mt-2 block font-display font-bold uppercase [font-stretch:108%] group-hover:text-accent">
                    {step.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <div className="flex flex-col gap-16">
        {guide.map((step) => {
          const task = step.task ? taskBySlug(step.task) : undefined;
          return (
            <section
              key={step.week}
              id={`semana-${step.week}`}
              aria-labelledby={`semana-${step.week}-titulo`}
              className="scroll-mt-20"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
                <span className="font-mono text-sm text-accent">{pad(step.week)}</span>
                <h2 id={`semana-${step.week}-titulo`} className="text-2xl font-bold uppercase sm:text-3xl">
                  {step.title}
                </h2>
                <span className="font-mono text-xs uppercase tracking-wider text-muted">{weekRange(step.week)}</span>
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div>
                  <p className="text-lg leading-relaxed">{step.goal}</p>
                  <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">Qué hacer</h3>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-relaxed">
                    {step.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  {task && (
                    <p className="mt-6 text-sm">
                      <span className="text-muted">Para practicar: </span>
                      <Link
                        href={`/tareas/${task.slug}`}
                        className="font-medium text-accent underline underline-offset-4"
                      >
                        la tarea {task.track} →
                      </Link>
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted">Recursos</h3>
                  <ul className="mt-2 flex flex-col gap-px overflow-hidden border border-border bg-border">
                    {resourcesOf(step).map((entry) => (
                      <Resource key={entry.id} entry={entry} />
                    ))}
                  </ul>
                  <Link
                    href={`/biblioteca?semana=${step.week}`}
                    className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-muted hover:text-accent"
                  >
                    Todo lo de la semana {step.week} →
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
