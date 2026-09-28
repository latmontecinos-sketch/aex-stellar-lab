// Piezas del resumen de una tarea: el video del entregable y la lista de lo que pide.
import type { Task } from "@/content/schema";
import { SmartLink } from "@/components/ui";

export type ChecklistItem = { done: boolean; text: string; link?: { label: string; href: string } };

export function driveVideo(task: Task) {
  return task.videoDriveId
    ? {
        view: `https://drive.google.com/file/d/${task.videoDriveId}/view`,
        embed: `https://drive.google.com/file/d/${task.videoDriveId}/preview`,
      }
    : null;
}

export function TaskVideo({ task, description }: { task: Task; description: string }) {
  const video = driveVideo(task);
  if (!video) return null;
  return (
    <section aria-labelledby="video">
      <h2 id="video" className="text-xl font-bold tracking-tight">
        El video
      </h2>
      <p className="mt-3 leading-relaxed text-muted">{description}</p>
      <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-border bg-surface-2">
        <iframe
          src={video.embed}
          title={`Video del entregable de ${task.project}`}
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
      <a
        href={video.view}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
      >
        Abrir en Google Drive ↗
      </a>
    </section>
  );
}

export function DeliverableChecklist({ items }: { items: ChecklistItem[] }) {
  return (
    <aside aria-labelledby="entregable" className="lg:pt-1">
      <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
        <h2 id="entregable" className="font-semibold">
          Lo que pide el entregable
        </h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.text} className="flex gap-3 text-sm">
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                  item.done ? "bg-ok text-surface" : "border border-border text-muted"
                }`}
              >
                {item.done ? "✓" : ""}
              </span>
              <span>
                <span className="sr-only">{item.done ? "Hecho: " : "Pendiente: "}</span>
                <span className={item.done ? "" : "text-muted"}>{item.text}</span>
                {item.link && (
                  <SmartLink href={item.link.href} className="mt-0.5 block font-medium text-accent hover:underline">
                    {item.link.label}
                  </SmartLink>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
