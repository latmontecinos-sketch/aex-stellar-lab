import type { Metadata } from "next";
import Link from "next/link";
import { EXPLORER, ORIGINAL_CONTRACT } from "@/lib/stellar";

export const metadata: Metadata = {
  title: "Aex Pass",
  description: "Tarea de Stellar Elite: invocación de un contrato del track Event Pass, con su ejecución y explicación.",
};

const VIDEO_ID = "1-nq9EBfyCn2hW4X8z4S2fxjh59gtMGR-";
const VIDEO_URL = `https://drive.google.com/file/d/${VIDEO_ID}/view`;

const checklist: { done: boolean; text: string; link?: { label: string; href: string } }[] = [
  {
    done: true,
    text: "Un contrato propio del track Event Pass: el ledger verifica que una cuenta compró su pase y que lo usó una sola vez.",
    link: { label: "Ver el código", href: "https://github.com/latmontecinos-sketch/aex-pass/blob/main/src/lib.rs" },
  },
  {
    done: true,
    text: "Una invocación exitosa desde el Stellar CLI: compra y check-in reales en testnet.",
    link: { label: "Ver la ejecución", href: "/tareas/aex-pass/ejecucion" },
  },
  {
    done: true,
    text: "El evento y el estado resultante vistos en el explorador: los eventos bought y checked_in, y el pase en Used.",
    link: { label: "Abrir el contrato", href: `${EXPLORER}/contract/${ORIGINAL_CONTRACT}` },
  },
  {
    done: true,
    text: "Qué sigo aprendiendo (abajo).",
  },
  {
    done: true,
    text: "El video de 3 minutos, entregado el 23 de septiembre.",
    link: { label: "Ver el video", href: VIDEO_URL },
  },
];

const nextSteps = [
  {
    title: "El ciclo de vida del storage",
    text: "El TTL y la renta: mi primera compra pagó 17,64 XLM por guardar datos 120 días. Quiero ajustar ese plazo a la duración real de un evento.",
  },
  {
    title: "Testing más profundo",
    text: "Mis pruebas ya verifican hasta el árbol de firmas. Lo siguiente es sumar fuzzing antes de mover dinero real.",
  },
  {
    title: "Contratos desde el frontend",
    text: "Invocar el contrato con la wallet del usuario, sin CLI, para que la puerta de un evento verifique los pases directamente en el ledger.",
  },
];

export default function AexPassSummary() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-10">
        <section aria-labelledby="consigna">
          <h2 id="consigna" className="text-xl font-bold tracking-tight">
            La consigna
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Grabar un video de 3 minutos con una invocación exitosa, desde el Stellar CLI o el Stellar Lab, de un
            contrato creado con uno de los tres tracks vistos en clase:
          </p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <strong className="text-text">Event Pass</strong>: el ledger verifica que una cuenta compró su pase y
              lo usó una sola vez.
            </li>
            <li>
              <strong className="text-text">Votación token gated</strong>: votan las cuentas con un mínimo de un
              voto por cuenta.
            </li>
            <li>
              <strong className="text-text">Sponsor board</strong>: espacios numerados que se pagan con un activo y
              quedan con un mensaje corto.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-muted">
            Además, mostrar el evento o el estado resultante en el explorador y contar qué es lo siguiente que hay
            que seguir aprendiendo.
          </p>
        </section>

        <section aria-labelledby="video">
          <h2 id="video" className="text-xl font-bold tracking-tight">
            El video
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            La invocación grabada desde el Stellar CLI, el evento y el estado en el explorador, y qué sigo aprendiendo.
          </p>
          <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-border bg-surface-2">
            <iframe
              src={`https://drive.google.com/file/d/${VIDEO_ID}/preview`}
              title="Video del entregable de Aex Pass"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          </div>
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
          >
            Abrir en Google Drive ↗
          </a>
        </section>

        <section aria-labelledby="solucion">
          <h2 id="solucion" className="text-xl font-bold tracking-tight">
            Mi solución
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Elegí <strong className="text-text">Event Pass</strong> y lo llevé a un caso concreto: un pase para
            entrar a un Meet pagado. El contrato <strong className="text-text">Aex Prueba Pass Stellar 01</strong>{" "}
            cobra 1 XLM, se lo paga al anfitrión y registra el pase; en la puerta, solo el anfitrión puede marcarlo
            como usado, y un segundo intento se rechaza.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/tareas/aex-pass/ejecucion"
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-semibold group-hover:text-accent">Ejecución →</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Los 11 pasos reales con el Stellar CLI, con comandos y transacciones. Y abajo, ejecútalo tú mismo
                desde el navegador.
              </p>
            </Link>
            <Link
              href="/tareas/aex-pass/explicacion"
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-semibold group-hover:text-accent">Cómo funciona →</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Las reglas, el recorrido de un pase, qué hace cada función, qué guarda en la blockchain y cuánto
                cuesta. En simple.
              </p>
            </Link>
          </div>
        </section>

        <section aria-labelledby="aprendiendo">
          <h2 id="aprendiendo" className="text-xl font-bold tracking-tight">
            Qué sigo aprendiendo
          </h2>
          <ol className="mt-4 grid gap-3">
            {nextSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <aside aria-labelledby="entregable" className="lg:pt-1">
        <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
          <h2 id="entregable" className="font-semibold">
            Lo que pide el entregable
          </h2>
          <ul className="mt-4 space-y-3">
            {checklist.map((item) => (
              <li key={item.text} className="flex gap-3 text-sm">
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                    item.done ? "bg-ok text-surface" : "border border-border text-muted"
                  }`}
                >
                  {item.done ? "✓" : ""}
                </span>
                <span>
                  <span className="sr-only">{item.done ? "Hecho: " : "Pendiente: "}</span>
                  <span className={item.done ? "" : "text-muted"}>{item.text}</span>
                  {item.link &&
                    (item.link.href.startsWith("http") ? (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block font-medium text-accent hover:underline"
                      >
                        {item.link.label} ↗
                      </a>
                    ) : (
                      <Link href={item.link.href} className="mt-0.5 block font-medium text-accent hover:underline">
                        {item.link.label} →
                      </Link>
                    ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
