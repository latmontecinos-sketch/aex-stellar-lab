import type { Metadata } from "next";
import Link from "next/link";
import { explorer } from "@/lib/deployment";
import { formatXlm } from "@/lib/format";
import {
  MIN_INVESTMENT,
  RWA_ASSET,
  RWA_REPO,
  RWA_RUN,
  RWA_SOURCE,
  RWA_TESTS_SOURCE,
  RWA_UPSTREAM,
} from "@/lib/rwa-deployment";
import { taskBySlug } from "@/content/tasks";
import { DeliverableChecklist, TaskVideo, driveVideo, type ChecklistItem } from "@/components/deliverable";
import { Mono, SmartLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "RWA Launchpad",
  description: "Tarea final de Stellar Elite: un RWA Launchpad en testnet con una regla de inversión mínima.",
};

const task = taskBySlug("rwa-launchpad");
const video = driveVideo(task);

const checklist: ChecklistItem[] = [
  { done: true, text: "El repo: un fork del bootcamp, trabajando en la carpeta dia-3.", link: { label: "Ver el repo", href: RWA_REPO } },
  {
    done: true,
    text: `La regla en check_variation_gate: una inversión de menos de ${MIN_INVESTMENT} falla con el error nuevo AmountTooLow.`,
    link: { label: "Ver el código", href: RWA_SOURCE },
  },
  {
    done: true,
    text: "Un test que comprueba que 100 falla y 500 funciona.",
    link: { label: "Ver el test", href: RWA_TESTS_SOURCE },
  },
  {
    done: true,
    text: `El contrato desplegado en testnet: ${RWA_RUN.contract}.`,
    link: { label: "Abrir en stellar.expert", href: explorer.contract(RWA_RUN.contract) },
  },
  {
    done: true,
    text: "El admin inicializa el contrato y agrega al inversionista a la whitelist, con admin-tool.sh.",
    link: { label: "Ver la ejecución", href: "/tareas/rwa-launchpad/ejecucion" },
  },
  RWA_RUN.investTx
    ? {
        done: true,
        text: "El inversionista invierte 100 (falla), 500 (funciona) y consulta su balance, con user-tool.sh.",
        link: { label: "Ver la inversión exitosa", href: explorer.tx(RWA_RUN.investTx) },
      }
    : { done: false, text: "El inversionista invierte 100 (falla), 500 (funciona) y consulta su balance, con user-tool.sh." },
  video
    ? { done: true, text: "El video con la inversión fallida y la exitosa.", link: { label: "Ver el video", href: video.view } }
    : { done: false, text: "El video (máximo 2 minutos) con la inversión fallida y la exitosa." },
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
            Desplegar en testnet un RWA Launchpad propio con una regla simple de inversión, y demostrar que funciona.
            La base es la carpeta <Mono>dia-3</Mono> del{" "}
            <SmartLink href={RWA_UPSTREAM} className="text-text underline decoration-dotted underline-offset-4">
              repo del bootcamp
            </SmartLink>
            .
          </p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <strong className="text-text">La regla</strong>: en <Mono>check_variation_gate</Mono>, cada inversión
              tiene que ser de al menos {MIN_INVESTMENT.toString()} unidades del token de pago. Si es menor, falla con
              un error nuevo, <Mono>AmountTooLow</Mono>.
            </li>
            <li>
              <strong className="text-text">El test</strong>: una inversión de 100 falla y una de 500 funciona.
            </li>
            <li>
              <strong className="text-text">El flujo en testnet</strong>, con los scripts del repo: el admin inicializa
              y agrega al inversionista a la whitelist; el inversionista intenta invertir 100 (falla), invierte 500
              (funciona) y consulta su balance.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-muted">
            Se entrega el link al repo, el Contract ID, el link de stellar.expert de la inversión exitosa y un video
            corto (máximo 2 minutos) con la inversión fallida y la exitosa.
          </p>
        </section>

        <TaskVideo task={task} description="La inversión de 100 rechazada con AmountTooLow y la de 500 aceptada, en testnet." />

        <section aria-labelledby="solucion">
          <h2 id="solucion" className="text-xl font-bold tracking-tight">
            Mi solución
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Agregué la regla en el contrato de <Mono>dia-3</Mono> con dos tests, lo desplegué en testnet y adapté los
            scripts de admin y de usuario para que corran exactamente el flujo de la tarea. Como token de pago uso el
            XLM de la red de prueba: {MIN_INVESTMENT.toString()} unidades son {formatXlm(MIN_INVESTMENT)} XLM y compran{" "}
            {(MIN_INVESTMENT / RWA_ASSET.pricePerUnit).toString()} RWA.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/tareas/rwa-launchpad/ejecucion"
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-semibold group-hover:text-accent">Ejecución →</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                El flujo completo con los scripts, con sus transacciones. Y abajo, hazlo tú mismo desde el navegador.
              </p>
            </Link>
            <Link
              href="/tareas/rwa-launchpad/explicacion"
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-semibold group-hover:text-accent">Cómo funciona →</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Qué es un RWA Launchpad, dónde va la regla, por qué 500 unidades dan 5 RWA y cómo lo prueban los tests.
              </p>
            </Link>
          </div>
        </section>
      </div>

      <DeliverableChecklist items={checklist} />
    </div>
  );
}
