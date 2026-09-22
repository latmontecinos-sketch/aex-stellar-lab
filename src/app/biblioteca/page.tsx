import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/library-browser";
import { KIND_ORDER, type Kind } from "@/content/lab";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Repositorios, apuntes, recursos y herramientas de lo que voy aprendiendo en Stellar.",
};

export default async function BibliotecaPage({ searchParams }: PageProps<"/biblioteca">) {
  const { tipo } = await searchParams;
  const initialKind = KIND_ORDER.includes(tipo as Kind) ? (tipo as Kind) : null;

  return (
    <>
      <section className="py-10 sm:py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Biblioteca</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Todo lo que voy juntando en el programa: los repositorios que construyo, apuntes con lo que aprendí,
          y los recursos y herramientas que uso.
        </p>
      </section>
      <LibraryBrowser initialKind={initialKind} />
    </>
  );
}
