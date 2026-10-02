import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CodeBlock, SectionHeading } from "@/components/ui";
import { classNotes, formatTime, notesFor } from "@/content/class-notes";
import { library } from "@/content/library";
import { formatDate } from "@/content/schema";

// Solo existen las páginas de las clases con apuntes.
export const dynamicParams = false;

export function generateStaticParams() {
  return classNotes.map((n) => ({ id: n.session }));
}

function load(id: string) {
  const notes = notesFor(id);
  const entry = library.find((e) => e.id === id);
  if (!notes || !entry?.video) notFound();
  return { notes, entry, video: entry.video };
}

export async function generateMetadata(props: PageProps<"/biblioteca/clase/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const { notes, entry } = load(id);
  return { title: `Apuntes · ${entry.title}`, description: notes.summary };
}

function At({ video, t }: { video: string; t: number }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video}&t=${t}s`}
      target="_blank"
      rel="noreferrer"
      className="shrink-0 font-mono text-xs text-accent underline-offset-4 hover:underline"
    >
      ▶ {formatTime(t)}
    </a>
  );
}

function Block({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="pb-14">
      <SectionHeading id={id} index={index} title={title} />
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function ClassNotesPage(props: PageProps<"/biblioteca/clase/[id]">) {
  const { id } = await props.params;
  const { notes, entry, video } = load(id);

  return (
    <>
      <section className="pt-14 pb-12 sm:pt-20">
        <Link href="/biblioteca" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent">
          ← Biblioteca
        </Link>
        <p className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          <span aria-hidden className="h-2 w-2 bg-accent" />
          Apuntes de clase · Semana {entry.week} · {formatDate(entry.date)}
        </p>
        <h1 className="mt-4 text-4xl leading-none font-extrabold uppercase [font-stretch:120%] sm:text-6xl">
          {entry.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{notes.summary}</p>
        <a
          href={`https://www.youtube.com/watch?v=${video}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex font-medium text-accent underline underline-offset-4"
        >
          Ver el video en YouTube ↗
        </a>
        <p className="mt-3 text-sm text-muted">Hechos con mi app que estudia los videos, y revisados.</p>
      </section>

      <Block id="vision" index="01" title="En pocas palabras">
        <ul className="max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed">
          {notes.overview.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Block>

      <Block id="temas" index="02" title="Temas">
        <ol className="flex flex-col gap-px overflow-hidden border border-border bg-border">
          {notes.topics.map((topic, i) => (
            <li key={topic.title} className="bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-bold">
                  <span className="mr-2 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {topic.title}
                </h3>
                <At video={video} t={topic.t} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{topic.text}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {topic.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="conceptos" index="03" title="Conceptos clave">
        <dl className="grid gap-4 sm:grid-cols-2">
          {notes.concepts.map((c) => (
            <div key={c.term} className="rounded-2xl border border-border bg-surface p-5">
              <dt className="flex items-baseline justify-between gap-3 font-bold">
                {c.term}
                <At video={video} t={c.t} />
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{c.text}</dd>
            </div>
          ))}
        </dl>
      </Block>

      {notes.commands.length > 0 && (
        <Block id="comandos" index="04" title="Comandos">
          <ul className="flex flex-col gap-5">
            {notes.commands.map((c) => (
              <li key={c.code}>
                <CodeBlock>{c.code}</CodeBlock>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3 text-sm text-muted">
                  {c.text} <At video={video} t={c.t} />
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block id="repaso" index="05" title="Preguntas de repaso">
        <ol className="flex max-w-3xl flex-col gap-3">
          {notes.questions.map((item) => (
            <li key={item.q}>
              <details className="rounded-xl border border-border bg-surface px-5 py-3">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="conclusiones" index="06" title="Conclusiones">
        <ul className="max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed">
          {notes.takeaways.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Block>
    </>
  );
}
