import type { Metadata } from "next";
import { EntryCard } from "@/components/cards";
import { LibraryBrowser, type IndexEntry } from "@/components/library-browser";
import { library } from "@/content/library";
import { KIND_ORDER, byOrder } from "@/content/schema";

export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "Clases, apuntes, documentación, repositorios, skills, herramientas, lecturas y oportunidades de lo que voy aprendiendo en Stellar, semana a semana.",
};

// Ordenadas una vez en el servidor: por sección y, dentro de cada una, por `order`.
const sorted = KIND_ORDER.flatMap((kind) => library.filter((e) => e.kind === kind).sort(byOrder));

const index: IndexEntry[] = sorted.map((e) => ({
  id: e.id,
  kind: e.kind,
  week: e.week,
  date: e.date,
  order: e.order ?? 999,
  title: e.title,
  session: e.session,
  review: Boolean(e.review),
  text: [e.title, e.summary, e.author ?? "", ...e.tags].join(" "),
}));

export default function BibliotecaPage() {
  const cards = Object.fromEntries(sorted.map((entry) => [entry.id, <EntryCard key={entry.id} entry={entry} />]));
  return (
    <>
      <section className="pt-14 pb-10 sm:pt-20 sm:pb-12">
        <h1 className="text-4xl leading-none font-extrabold uppercase [font-stretch:120%] sm:text-6xl">Biblioteca</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Lo que voy juntando en el programa, semana a semana y clase a clase: debajo de cada clase está lo que se
          compartió en ella. También se puede ver por tipo.
        </p>
      </section>
      <LibraryBrowser index={index} cards={cards} />
    </>
  );
}
