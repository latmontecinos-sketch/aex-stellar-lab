import type { Metadata } from "next";
import { TaskCard } from "@/components/cards";
import { tasks } from "@/content/lab";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Las tareas de Stellar Elite Bolivia, cada una con su ejecución y su explicación.",
};

export default function TareasPage() {
  const sorted = [...tasks].sort((a, b) => b.due.localeCompare(a.due));
  return (
    <>
      <section className="py-10 sm:py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tareas</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Las tareas del programa. Cada una tiene su consigna, la ejecución real y una explicación de cómo
          funciona.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((task) => (
          <TaskCard key={task.slug} task={task} />
        ))}
      </div>
    </>
  );
}
