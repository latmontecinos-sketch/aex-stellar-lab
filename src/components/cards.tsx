import Link from "next/link";
import {
  KIND_LABELS,
  STATUS_LABELS,
  formatDate,
  tasks,
  type Entry,
  type Kind,
  type Task,
} from "@/content/lab";

const KIND_STYLES: Record<Kind, string> = {
  repositorio: "bg-accent-soft text-accent",
  apunte: "bg-ok-soft text-ok",
  recurso: "bg-warn-soft text-text",
  herramienta: "bg-surface-2 text-muted",
};

const STATUS_STYLES: Record<Task["status"], string> = {
  pendiente: "bg-surface-2 text-muted",
  "en-progreso": "bg-warn-soft text-text",
  entregado: "bg-ok-soft text-ok",
};

function isExternal(href: string) {
  return href.startsWith("http");
}

export function EntryCard({ entry }: { entry: Entry }) {
  const task = entry.task ? tasks.find((t) => t.slug === entry.task) : undefined;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-0.5 font-medium ${KIND_STYLES[entry.kind]}`}>
          {KIND_LABELS[entry.kind].one}
        </span>
        <span className="text-muted">{formatDate(entry.date)}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{entry.title}</h3>
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
        {entry.links.map((link) =>
          isExternal(link.href) ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {link.label} ↗
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {link.label} →
            </Link>
          ),
        )}
        {task && (
          <Link href={`/tareas/${task.slug}`} className="text-muted underline-offset-4 hover:text-text hover:underline">
            Tarea: {task.track}
          </Link>
        )}
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
        <span className="text-muted">Entrega: {formatDate(task.due)}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-accent">{task.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{task.summary}</p>
      <span className="mt-4 inline-block text-sm font-medium text-accent">Abrir tarea →</span>
    </Link>
  );
}
