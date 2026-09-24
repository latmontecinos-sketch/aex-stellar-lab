// Piezas de interfaz compartidas por las páginas de tareas. Sirven tanto en
// componentes de servidor como de cliente.
import Link from "next/link";
import type { ReactNode } from "react";
import { explorer } from "@/lib/deployment";
import { short } from "@/lib/format";

export function isExternal(href: string) {
  return href.startsWith("http");
}

/** Un enlace que se abre en otra pestaña si es externo y navega con el router si es interno. */
export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children} ↗
    </a>
  ) : (
    <Link href={href} className={className}>
      {children} →
    </Link>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="font-mono text-[0.9em]">{children}</code>;
}

export function TxLink({ hash, children }: { hash: string; children?: ReactNode }) {
  return (
    <a
      href={explorer.tx(hash)}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-accent underline-offset-4 hover:underline"
    >
      {children ?? `tx ${hash.slice(0, 8)}…`} ↗
    </a>
  );
}

export function AddressLink({ address, kind = "account" }: { address: string; kind?: "account" | "contract" }) {
  return (
    <a
      href={kind === "account" ? explorer.account(address) : explorer.contract(address)}
      target="_blank"
      rel="noreferrer"
      className="font-mono underline decoration-dotted underline-offset-4"
    >
      {short(address)}
    </a>
  );
}

/** Un término del glosario de la página «Cómo funciona». */
export function Term({ children }: { children: ReactNode }) {
  return (
    <Link href="/tareas/aex-pass/explicacion#glosario" className="text-text underline decoration-dotted underline-offset-4">
      {children}
    </Link>
  );
}

export type Tone = "ok" | "bad" | "info";

const TONE_BOX: Record<Tone, string> = { ok: "bg-ok-soft", bad: "bg-bad-soft", info: "bg-surface-2" };
const TONE_LABEL: Record<Tone, string> = { ok: "text-ok", bad: "text-bad", info: "text-muted" };

/** La caja «Resultado» de cada paso. */
export function ResultBox({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <div className={`rounded-xl px-4 py-3 text-sm ${TONE_BOX[tone]}`}>
      <p className={`mb-1 text-xs font-semibold uppercase tracking-wide ${TONE_LABEL[tone]}`}>
        {tone === "bad" ? "Resultado: rechazado" : "Resultado"}
      </p>
      <div className="leading-relaxed text-text">{children}</div>
    </div>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-code-bg p-4 font-mono text-xs leading-relaxed text-code-text">
      {children}
    </pre>
  );
}
