import type { ReactNode } from "react";
import { CodeBlock, TxLink } from "@/components/ui";

export type StepStatus = "locked" | "ready" | "done";

export function Step({
  n,
  title,
  actor,
  status,
  explanation,
  action,
  error,
  command,
  txHash,
  children,
}: {
  n: number;
  title: string;
  actor: string;
  status: StepStatus;
  explanation: ReactNode;
  action?: ReactNode;
  error?: string;
  command: string;
  txHash?: string;
  children?: ReactNode;
}) {
  const locked = status === "locked";
  return (
    <li
      id={`paso-${n}`}
      className={`rounded-2xl border bg-surface p-5 transition-opacity sm:p-6 ${
        status === "ready" ? "border-accent shadow-sm" : "border-border"
      } ${locked ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            status === "done" ? "bg-ok text-surface" : status === "ready" ? "bg-accent text-surface" : "bg-surface-2 text-muted"
          }`}
        >
          {status === "done" ? "✓" : n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg font-semibold">
              <span className="sr-only">Paso {n}: </span>
              {title}
            </h3>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">{actor}</span>
            {locked && <span className="text-xs text-muted">Completa el paso anterior</span>}
          </div>
          <p className="mt-2 leading-relaxed text-muted">{explanation}</p>

          {!locked && action && <div className="mt-4">{action}</div>}
          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">
              {error}
            </p>
          )}
          <div aria-live="polite">{children && <div className="mt-4">{children}</div>}</div>

          {txHash && (
            <p className="mt-4 text-sm">
              <TxLink hash={txHash}>Ver la transacción en el explorador</TxLink>
            </p>
          )}
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-sm text-muted hover:text-text">
              <span className="inline-block transition-transform group-open:rotate-90">›</span> Ver como comando
              del Stellar CLI
            </summary>
            <div className="mt-2">
              <CodeBlock>{command}</CodeBlock>
            </div>
          </details>
        </div>
      </div>
    </li>
  );
}

export function ActionButton({
  onClick,
  busy,
  disabled,
  children,
}: {
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy && (
        <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
      )}
      {busy ? "Enviando a la red…" : children}
    </button>
  );
}
