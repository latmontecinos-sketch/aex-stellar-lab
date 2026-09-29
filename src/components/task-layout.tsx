import Link from "next/link";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/cards";
import { TaskTabs } from "@/components/task-tabs";
import { formatDue, type Task } from "@/content/schema";

/** Encabezado y pestañas de una tarea: Resumen · Ejecución · Cómo funciona. */
export function TaskLayout({ task, children }: { task: Task; children: ReactNode }) {
  return (
    <>
      <div className="pt-8 sm:pt-10">
        <nav aria-label="Ruta" className="font-mono text-xs uppercase tracking-wider text-muted">
          <Link href="/tareas" className="hover:text-text">
            Tareas
          </Link>{" "}
          / <span className="text-text">{task.project}</span>
        </nav>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <StatusBadge task={task} />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Track {task.track} · Entrega: {formatDue(task)}
          </span>
        </div>
        <h1 className="mt-4 text-4xl leading-none font-extrabold uppercase [font-stretch:120%] sm:text-5xl">{task.project}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{task.pitch}</p>
        <div className="mt-6">
          <TaskTabs
            base={`/tareas/${task.slug}`}
            tabs={[
              { href: "", label: "Resumen" },
              { href: "/ejecucion", label: "Ejecución" },
              { href: "/explicacion", label: "Cómo funciona" },
            ]}
          />
        </div>
      </div>
      <div className="pt-8">{children}</div>
    </>
  );
}
