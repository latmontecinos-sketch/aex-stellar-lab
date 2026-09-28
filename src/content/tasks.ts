// Las tareas del programa. Cada una tiene su carpeta en src/app/tareas/<slug>.
import type { Task } from "./schema";

export const tasks: Task[] = [
  {
    slug: "rwa-launchpad",
    title: "Tarea final: RWA Launchpad en testnet",
    track: "RWA Launchpad",
    week: 4,
    status: "en-progreso",
    project: "RWA Launchpad",
    pitch: "Un launchpad de activos del mundo real en Stellar, con una regla: cada inversión es de al menos 500 unidades.",
    summary:
      "El launchpad del bootcamp desplegado en testnet con una regla de inversión mínima (AmountTooLow), su test, y el flujo completo del admin y del inversionista con los scripts del repo.",
  },
  {
    slug: "aex-pass",
    title: "Invocación de un contrato: Event Pass",
    track: "Event Pass",
    week: 3,
    due: "2026-09-17",
    status: "entregado",
    statusNote: "En revisión",
    project: "Aex Pass",
    pitch: "Un pase para entrar a un Meet que no se puede usar dos veces, controlado por un contrato en Stellar.",
    videoDriveId: "1-nq9EBfyCn2hW4X8z4S2fxjh59gtMGR-",
    summary:
      "Un contrato propio con una invocación exitosa desde el Stellar CLI, su evento y estado en el explorador, y qué sigo aprendiendo. Mi solución: Aex Pass, un pase para entrar a un Meet.",
  },
];

/** La tarea por su slug. Cada tarea tiene su propia carpeta de páginas, así que no existir es un error de código. */
export function taskBySlug(slug: string): Task {
  const task = tasks.find((t) => t.slug === slug);
  if (!task) throw new Error(`No existe la tarea "${slug}" en src/content/tasks.ts`);
  return task;
}
