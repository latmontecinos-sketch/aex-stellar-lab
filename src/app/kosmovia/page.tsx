import type { Metadata } from "next";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { kosmovia } from "@/content/kosmovia";
import { site } from "@/content/schema";

export const metadata: Metadata = {
  title: "Kosmovia",
  description: `Kosmovia, el proyecto de mi equipo en ${site.program}: ${kosmovia.pitch}`,
};

export default function KosmoviaPage() {
  return (
    <>
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-20">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          <span aria-hidden className="h-2 w-2 bg-accent" />
          Proyecto de equipo · {site.program}
        </p>
        <h1 className="mt-6 text-5xl leading-[0.92] font-extrabold uppercase [font-stretch:125%] sm:text-7xl lg:text-8xl">
          Kosmovia
        </h1>
        <p className="mt-5 font-mono text-sm uppercase tracking-wider text-accent">{kosmovia.tagline}</p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{kosmovia.pitch}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={kosmovia.site}>Ver el sitio</ButtonLink>
          <ButtonLink href={kosmovia.repo} variant="secondary">
            GitHub
          </ButtonLink>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted">{kosmovia.status}</p>
      </section>

      <section aria-labelledby="que-hace" className="pb-16">
        <SectionHeading id="que-hace" index="01" title="Qué hace" />
        <ul className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {kosmovia.features.map((f, i) => (
            <li key={f.title} className="bg-surface p-5">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-bold uppercase">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="etapas" className="pb-16">
        <SectionHeading id="etapas" index="02" title="Por etapas" />
        <ol className="mt-6 border border-border bg-surface">
          {kosmovia.stages.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-t border-border px-5 py-3 first:border-t-0 sm:grid-cols-[2.5rem_12rem_1fr_7rem]"
            >
              <span className="font-mono text-sm text-accent">{s.id}</span>
              <span className="font-display font-bold uppercase [font-stretch:104%]">{s.title}</span>
              <span className="col-start-2 text-sm text-muted sm:col-start-auto">{s.text}</span>
              <span className="col-start-2 font-mono text-[11px] uppercase tracking-wider text-muted sm:col-start-auto sm:text-right">
                {s.when}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="mi-parte">
        <SectionHeading id="mi-parte" index="03" title="Mi parte" />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{kosmovia.myRole}</p>
        <p className="mt-2 text-sm text-muted">Somos {kosmovia.teamSize} en el equipo.</p>
      </section>
    </>
  );
}
