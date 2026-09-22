import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/library-browser";
import { KIND_ORDER, library, type Kind } from "@/content/lab";

export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "Clases, apuntes, documentación, repositorios, skills, herramientas, lecturas y oportunidades de lo que voy aprendiendo en Stellar.",
};

export default async function BibliotecaPage({ searchParams }: PageProps<"/biblioteca">) {
  const { tipo, semana } = await searchParams;
  const initialKind = KIND_ORDER.includes(tipo as Kind) ? (tipo as Kind) : null;
  const weekNumber = Number(semana);
  const initialWeek = library.some((e) => e.week === weekNumber) ? weekNumber : null;

  return (
    <>
      <section className="py-10 sm:py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Biblioteca</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Todo lo que voy juntando en el programa, ordenado por secciones: las clases, mis apuntes, la
          documentación, los repositorios, las skills, las herramientas, lecturas y oportunidades. Cada entrada
          dice en qué semana llegó.
        </p>
      </section>
      <LibraryBrowser initialKind={initialKind} initialWeek={initialWeek} />
    </>
  );
}
