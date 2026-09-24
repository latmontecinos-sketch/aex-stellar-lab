import type { ContractEvent, PassStatus, Read } from "@/lib/stellar";
import { explorer } from "@/lib/deployment";
import { formatXlm, short } from "@/lib/format";

export type Live = {
  /** El contrato del que se leyó `pass` y `events`. */
  contractId?: string;
  pass: Read<PassStatus> | null;
  hostBalance: Read<bigint> | null;
  guestBalance: Read<bigint> | null;
  events: Read<{ events: ContractEvent[]; truncated: boolean }> | null;
  updatedAt: Date | null;
};

export const EMPTY_LIVE: Live = { pass: null, hostBalance: null, guestBalance: null, events: null, updatedAt: null };

const PASS_STAGES: { key: PassStatus; label: string }[] = [
  { key: "none", label: "Sin pase" },
  { key: "bought", label: "Comprado" },
  { key: "used", label: "Usado" },
];

function Unreadable({ message }: { message: string }) {
  return (
    <p className="mt-2 rounded-xl bg-bad-soft px-3 py-2 text-xs text-bad" title={message}>
      No se pudo leer de la red. Prueba con «Actualizar».
    </p>
  );
}

function Balance({ label, address, read }: { label: string; address: string | null; read: Read<bigint> | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt>
        {label} {address && <span className="font-mono text-xs text-muted">{short(address)}</span>}
      </dt>
      <dd className="font-mono">
        {read === null ? "…" : read.ok ? `${formatXlm(read.value, 4)} XLM` : <span className="text-bad">sin leer</span>}
      </dd>
    </div>
  );
}

export function LivePanel({
  live,
  hasAccounts,
  hasContract,
  host,
  guest,
  contractId,
  refreshing,
  onRefresh,
}: {
  live: Live;
  hasAccounts: boolean;
  hasContract: boolean;
  host: string | null;
  guest: string | null;
  contractId?: string;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const pass = live.pass?.ok ? live.pass.value : null;
  const stageIndex = pass ? PASS_STAGES.findIndex((s) => s.key === pass) : -1;
  return (
    <aside className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6" aria-label="Estado en la blockchain">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Lo que dice la blockchain</h3>
        <button
          type="button"
          onClick={onRefresh}
          disabled={!hasAccounts || refreshing}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {refreshing ? "Leyendo…" : "Actualizar"}
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">Esto no es la memoria de la página: se lee directo de la red en cada paso.</p>

      {!hasAccounts ? (
        <p className="mt-5 rounded-xl bg-surface-2 p-4 text-sm text-muted">
          Crea las cuentas en el paso 1 para empezar a ver el estado real.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Pase del invitado</h4>
            {!hasContract ? (
              <p className="mt-2 text-sm text-muted">Todavía no hay evento.</p>
            ) : live.pass && !live.pass.ok ? (
              <Unreadable message={live.pass.message} />
            ) : (
              <ol className="mt-3 grid grid-cols-3 gap-2">
                {PASS_STAGES.map((stage, i) => (
                  <li
                    key={stage.key}
                    className={`rounded-xl px-2 py-2 text-center text-sm ${
                      i === stageIndex
                        ? stage.key === "used"
                          ? "bg-ok font-semibold text-surface"
                          : "bg-accent font-semibold text-surface"
                        : i < stageIndex
                          ? "bg-surface-2 text-muted line-through"
                          : "bg-surface-2 text-muted"
                    }`}
                    aria-current={i === stageIndex ? "step" : undefined}
                  >
                    {stage.label}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Saldos</h4>
            <dl className="mt-2 space-y-1.5 text-sm">
              <Balance label="Anfitrión" address={host} read={live.hostBalance} />
              <Balance label="Invitado" address={guest} read={live.guestBalance} />
            </dl>
            <p className="mt-2 text-xs text-muted">
              El invitado baja un poco más que el precio: también paga la comisión de la red.
            </p>
          </section>

          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Eventos del contrato</h4>
            {!hasContract ? (
              <p className="mt-2 text-sm text-muted">Todavía no hay evento.</p>
            ) : live.events === null ? (
              <p className="mt-2 text-sm text-muted">Leyendo…</p>
            ) : !live.events.ok ? (
              <Unreadable message={live.events.message} />
            ) : (
              <>
                {live.events.value.truncated && (
                  <p className="mt-2 text-xs text-muted">
                    El RPC solo guarda los últimos 7 días: los eventos más viejos ya no se pueden leer desde aquí, pero
                    siguen en el explorador.
                  </p>
                )}
                {live.events.value.events.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">Aún no hay eventos.</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm">
                    {live.events.value.events.map((event) => (
                      <li key={event.id} className="rounded-xl bg-surface-2 px-3 py-2">
                        <code className="font-mono font-semibold">{event.name}</code>{" "}
                        <span className="text-muted">
                          {event.name === "bought"
                            ? `el invitado compró su pase${event.price !== null ? ` por ${formatXlm(event.price)} XLM` : ""}`
                            : event.name === "checked_in"
                              ? "el invitado entró al Meet"
                              : ""}
                        </span>
                        <a
                          href={explorer.tx(event.txHash)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-0.5 block text-xs text-accent hover:underline"
                        >
                          bloque {event.ledger.toLocaleString("es-BO")} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {contractId && (
            <a
              href={explorer.contract(contractId)}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              Ver el contrato en el explorador ↗
            </a>
          )}
          {live.updatedAt && (
            <p className="text-xs text-muted">
              Leído a las{" "}
              {live.updatedAt.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
