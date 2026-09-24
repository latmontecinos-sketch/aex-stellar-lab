import Image from "next/image";
import Link from "next/link";
import { KINDS, ORIGIN_LABELS, STATUS_LABELS, formatDate, type Entry, type Kind, type Task } from "@/content/schema";
import { tasks } from "@/content/tasks";
import { SmartLink } from "@/components/ui";

const KIND_STYLES: Record<Kind, string> = {
  clase: "bg-bad-soft text-bad",
  apunte: "bg-ok-soft text-ok",
  documentacion: "bg-accent-soft text-accent",
  repositorio: "bg-surface-2 text-text",
  skill: "bg-accent-soft text-accent",
  herramienta: "bg-surface-2 text-muted",
  lectura: "bg-warn-soft text-text",
  comunidad: "bg-warn-soft text-text",
};

const STATUS_STYLES: Record<Task["status"], string> = {
  pendiente: "bg-surface-2 text-muted",
  "en-progreso": "bg-warn-soft text-text",
  entregado: "bg-ok-soft text-ok",
};

export function EntryCard({ entry }: { entry: Entry }) {
  const task = entry.task ? tasks.find((t) => t.slug === entry.task) : undefined;
  const primary = entry.links[0];
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      {entry.video && primary && (
        <a href={primary.href} target="_blank" rel="noreferrer" className="group relative block aspect-video bg-surface-2">
          {/* Miniatura pública de YouTube, sin pasar por el optimizador; se carga al estar a la vista. */}
          <Image
            src={`https://i.ytimg.com/vi/${entry.video}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            unoptimized
            className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
          />
          <span
            aria-hidden
            className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-lg text-white"
          >
            ▶
          </span>
          <span className="sr-only">Ver {entry.title} en YouTube</span>
        </a>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-0.5 font-medium ${KIND_STYLES[entry.kind]}`}>
            {KINDS[entry.kind].one}
          </span>
          {entry.origin && (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-muted">
              {ORIGIN_LABELS[entry.origin]}
            </span>
          )}
          <span className="text-muted">
            Semana {entry.week} · {formatDate(entry.date)}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{entry.title}</h3>
        {entry.author && <p className="mt-0.5 text-sm text-muted">por {entry.author}</p>}
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{entry.summary}</p>
        {entry.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Etiquetas">
            {entry.tags.map((tag) => (
              <li key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          {entry.links.map((link) => (
            <SmartLink key={link.href} href={link.href} className="font-medium text-accent underline-offset-4 hover:underline">
              {link.label}
            </SmartLink>
          ))}
          {task && (
            <Link
              href={`/tareas/${task.slug}`}
              className="text-muted underline-offset-4 hover:text-text hover:underline"
            >
              Tarea: {task.track}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function StatusBadge({ task }: { task: Task }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
      {STATUS_LABELS[task.status]}
      {task.statusNote ? ` · ${task.statusNote}` : ""}
    </span>
  );
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      href={`/tareas/${task.slug}`}
      className="group block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <StatusBadge task={task} />
        <span className="text-muted">
          Semana {task.week} · Entrega: {formatDate(task.due)}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-accent">{task.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{task.summary}</p>
      <span className="mt-4 inline-block text-sm font-medium text-accent">Abrir tarea →</span>
    </Link>
  );
}
