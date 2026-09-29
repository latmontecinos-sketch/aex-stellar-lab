import type { Metadata } from "next";
import { TaskCard } from "@/components/cards";
import { byDueDesc } from "@/content/schema";
import { tasks } from "@/content/tasks";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Las tareas de Stellar Elite Bolivia, cada una con su ejecución y su explicación.",
};

export default function TareasPage() {
  const sorted = [...tasks].sort(byDueDesc);
  return (
    <>
      <section className="pt-14 pb-10 sm:pt-20 sm:pb-12">
        <h1 className="text-4xl leading-none font-extrabold uppercase [font-stretch:120%] sm:text-6xl">Tareas</h1>
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
