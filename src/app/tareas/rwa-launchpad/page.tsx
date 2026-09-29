import type { Metadata } from "next";
import Link from "next/link";
import { explorer } from "@/lib/deployment";
import { formatXlm, short } from "@/lib/format";
import { MIN_INVESTMENT, RWA_ASSET, RWA_REPO, RWA_RUN, RWA_SOURCE, RWA_TESTS_SOURCE, RWA_UPSTREAM } from "@/lib/rwa-deployment";
import { taskBySlug } from "@/content/tasks";
import { DeliverableChecklist, TaskVideo, driveVideo, type ChecklistItem } from "@/components/deliverable";
import { Mono, SmartLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "RWA Launchpad",
  description: "Tarea final de Stellar Elite: un RWA Launchpad en testnet con inversión mínima de 500.",
};

const task = taskBySlug("rwa-launchpad");
const video = driveVideo(task);
const minted = MIN_INVESTMENT / RWA_ASSET.pricePerUnit;
const flow = "Inversionista: 100 falla, 500 funciona, ve su balance.";

const checklist: ChecklistItem[] = [
  { done: true, text: "Repo: fork del bootcamp.", link: { label: "Ver en GitHub", href: RWA_REPO } },
  { done: true, text: "Regla AmountTooLow en check_variation_gate.", link: { label: "Ver el código", href: RWA_SOURCE } },
  { done: true, text: "Test: 100 falla, 500 funciona.", link: { label: "Ver el test", href: RWA_TESTS_SOURCE } },
  {
    done: true,
    text: `Contrato en testnet: ${short(RWA_RUN.contract)}.`,
    link: { label: "Ver en stellar.expert", href: explorer.contract(RWA_RUN.contract) },
  },
  { done: true, text: "Admin: inicializa y aprueba al inversionista.", link: { label: "Ver la ejecución", href: "/tareas/rwa-launchpad/ejecucion" } },
  RWA_RUN.investTx
    ? { done: true, text: flow, link: { label: "Ver la inversión exitosa", href: explorer.tx(RWA_RUN.investTx) } }
    : { done: false, text: flow },
  video
    ? { done: true, text: "Video: inversión fallida y exitosa.", link: { label: "Ver el video", href: video.view } }
    : { done: false, text: "Video: inversión fallida y exitosa (máx. 2 min)." },
];

export default function RwaLaunchpadSummary() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-10">
        <section aria-labelledby="consigna">
          <h2 id="consigna" className="text-xl font-bold tracking-tight">
            La consigna
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Tomar el launchpad del{" "}
            <SmartLink href={RWA_UPSTREAM} className="text-text underline decoration-dotted underline-offset-4">
              repo del bootcamp
            </SmartLink>{" "}
            (carpeta <Mono>dia-3</Mono>) y agregarle una regla:
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
            <li>
              Cada inversión es de al menos {MIN_INVESTMENT.toString()}. Si es menor, falla con el error{" "}
              <Mono>AmountTooLow</Mono>.
            </li>
            <li>Un test: 100 falla y 500 funciona.</li>
            <li>Desplegarlo en testnet y correr los scripts: el admin aprueba al inversionista, y este invierte 100 (falla) y 500 (funciona).</li>
          </ul>
        </section>

        <TaskVideo task={task} description="La inversión de 100 rechazada y la de 500 aceptada." />

        <section aria-labelledby="solucion">
          <h2 id="solucion" className="text-xl font-bold tracking-tight">
            Mi solución
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Agregué la regla y dos tests, desplegué el contrato y ajusté los scripts para que hagan justo ese flujo. Se
            paga con XLM de prueba: {MIN_INVESTMENT.toString()} unidades son {formatXlm(MIN_INVESTMENT)} XLM y
            compran {minted.toString()} RWA.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/tareas/rwa-launchpad/ejecucion"
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-semibold group-hover:text-accent">Ejecución →</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">El flujo con los scripts, y con botones.</p>
            </Link>
            <Link
              href="/tareas/rwa-launchpad/explicacion"
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-semibold group-hover:text-accent">Cómo funciona →</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">La regla, el precio y los tests, en simple.</p>
            </Link>
          </div>
        </section>
      </div>

      <DeliverableChecklist items={checklist} />
    </div>
  );
}
