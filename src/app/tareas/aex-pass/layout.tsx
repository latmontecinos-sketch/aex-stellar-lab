import Link from "next/link";
import { StatusBadge } from "@/components/cards";
import { TaskTabs } from "@/components/task-tabs";
import { formatDate, tasks } from "@/content/lab";

const task = tasks.find((t) => t.slug === "aex-pass")!;

export default function AexPassLayout({ children }: LayoutProps<"/tareas/aex-pass">) {
  return (
    <>
      <div className="pt-8 sm:pt-10">
        <nav aria-label="Ruta" className="text-sm text-muted">
          <Link href="/tareas" className="hover:text-text">
            Tareas
          </Link>{" "}
          / <span className="text-text">Aex Pass</span>
        </nav>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <StatusBadge task={task} />
          <span className="text-muted">
            Track {task.track} · Entrega: {formatDate(task.due)}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Aex Pass</h1>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted">
          Un pase para entrar a un Meet que no se puede usar dos veces, controlado por un contrato en Stellar.
        </p>
        <div className="mt-6">
          <TaskTabs
            base="/tareas/aex-pass"
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
