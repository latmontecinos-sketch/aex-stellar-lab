"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { TxOutcome, TxResolution } from "@/lib/stellar";
import { XLM_CONTRACT, explorer } from "@/lib/deployment";
import { MIN_INVESTMENT, RWA_ASSET, RWA_WASM_HASH, rwaError } from "@/lib/rwa-deployment";
import { formatXlm, short } from "@/lib/format";
import { AddressLink, ResultBox, TxLink } from "@/components/ui";
import { ActionButton, Step, type StepStatus } from "@/components/step";
import { getServerSession, getSession, subscribeSession, updateSession, type PendingStep, type Session } from "./session";

// El SDK de Stellar se descarga recién cuando la demo lo necesita.
const loadStellar = () => import("@/lib/stellar");
const loadRwa = () => import("@/lib/rwa");

// Las mismas cifras que usan los scripts: 100 queda por debajo del mínimo.
const SMALL = 100n;
const OK_AMOUNT = MIN_INVESTMENT;
// El SDK arma las transacciones con 5 minutos de validez.
const PENDING_EXPIRY_MS = 5 * 60_000;
const PENDING_RECHECK_MS = 10_000;

type Failure = Extract<TxOutcome, { ok: false }>;
type StepN = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function failureText(outcome: Pick<Failure, "code" | "message">): string {
  const error = rwaError(outcome.code);
  if (error) return `El contrato lo rechazó: ${error.meaning} (error #${outcome.code}, ${error.name}).`;
  return `No se pudo completar: ${outcome.message}`;
}

/** Unidades del token de pago (stroops de XLM), con su equivalente en XLM. */
function units(amount: bigint) {
  return `${amount} unidades (${formatXlm(amount)} XLM)`;
}

/** Lo que se guarda cuando una transacción se confirma, venga del botón o de recuperarla al volver. */
function confirmedPatch(step: PendingStep, hash: string, returned: unknown): Session {
  if (step === 2) return { pending: undefined, deployTx: hash, contractId: typeof returned === "string" ? returned : undefined };
  if (step === 3) return { pending: undefined, initTx: hash, initialized: true };
  if (step === 4) return { pending: undefined, whitelistTx: hash };
  return { pending: undefined, investTx: hash, minted: typeof returned === "bigint" ? returned.toString() : undefined };
}

const noopSubscribe = () => () => {};

export function RwaDemo() {
  const session = useSyncExternalStore(subscribeSession, getSession, getServerSession);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [busy, setBusy] = useState<StepN | null>(null);
  const [errors, setErrors] = useState<Partial<Record<StepN, string>>>({});
  const [recheck, setRecheck] = useState(0);

  const admin = session.adminPublic ?? null;
  const investor = session.investorPublic ?? null;
  const setError = (step: StepN, message: string) => setErrors((prev) => ({ ...prev, [step]: message }));

  // Una transacción quedó enviada sin confirmar (la página se cerró o se agotó
  // la espera): se pregunta a la red qué pasó con ella.
  const pending = session.pending;
  useEffect(() => {
    if (!pending || busy !== null) return;
    let cancelled = false;
    void (async () => {
      const s = await loadStellar();
      let res: TxResolution;
      try {
        res = await s.resolveTx(pending.hash);
      } catch {
        res = { status: "not_found" };
      }
      if (cancelled) return;
      if (res.status === "success") {
        updateSession(confirmedPatch(pending.step, pending.hash, res.returned));
      } else if (res.status === "failed") {
        updateSession({ pending: undefined });
        setError(pending.step, "La transacción anterior llegó a la red, pero falló. Intenta de nuevo.");
      } else if (Date.now() - pending.at > PENDING_EXPIRY_MS) {
        updateSession({ pending: undefined });
        setError(pending.step, "La transacción anterior nunca llegó a la red. Intenta de nuevo.");
      } else {
        setTimeout(() => !cancelled && setRecheck((n) => n + 1), PENDING_RECHECK_MS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pending, busy, recheck]);

  const focusStep = (n: number) =>
    setTimeout(() => document.getElementById(`paso-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);

  async function run(step: StepN, action: () => Promise<void>) {
    setBusy(step);
    setError(step, "");
    try {
      await action();
    } catch (error) {
      setError(step, error instanceof Error ? error.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setBusy(null);
    }
  }

  /** Guarda el hash apenas se firma, para poder recuperarla si la página se cierra esperando. */
  const remember = (step: PendingStep) => (hash: string) => updateSession({ pending: { step, hash, at: Date.now() } });

  /** Confirmada, pendiente o fallida. */
  function settle(step: PendingStep, outcome: TxOutcome, returned: unknown = null) {
    if (outcome.ok) {
      updateSession(confirmedPatch(step, outcome.hash, returned));
      return;
    }
    // Pendiente: queda guardada y el efecto de arriba la sigue consultando.
    if (outcome.pending) throw new Error(outcome.message);
    updateSession({ pending: undefined });
    throw new Error(failureText(outcome));
  }

  const createAccounts = () =>
    run(1, async () => {
      const s = await loadStellar();
      const [a, i] = await Promise.all([s.createFundedAccount(), s.createFundedAccount()]);
      updateSession(null);
      updateSession({ adminSecret: a.secret, adminPublic: a.publicKey, investorSecret: i.secret, investorPublic: i.publicKey });
      setErrors({});
      focusStep(2);
    });

  const deploy = () =>
    run(2, async () => {
      if (!session.adminSecret) throw new Error("Primero crea las cuentas (paso 1).");
      const r = await loadRwa();
      const result = await r.deployLaunchpad(session.adminSecret, remember(2));
      settle(2, result.outcome, result.contractId);
      focusStep(3);
    });

  const initialize = () =>
    run(3, async () => {
      if (!session.contractId || !session.adminSecret) throw new Error("Primero despliega el contrato (paso 2).");
      const r = await loadRwa();
      const outcome = await r.initializeLaunchpad(session.contractId, session.adminSecret, remember(3));
      if (!outcome.ok && outcome.code === 2) {
        // Ya estaba inicializado (la transacción entró pero la página no se enteró).
        updateSession({ pending: undefined, initialized: true });
      } else {
        settle(3, outcome);
      }
      focusStep(4);
    });

  const whitelist = () =>
    run(4, async () => {
      if (!session.contractId || !session.adminSecret || !investor) throw new Error("Primero inicializa el launchpad (paso 3).");
      const r = await loadRwa();
      settle(4, await r.whitelistInvestor(session.contractId, session.adminSecret, investor, remember(4)));
      focusStep(5);
    });

  const investSmall = () =>
    run(5, async () => {
      if (!session.contractId || !session.investorSecret) throw new Error("Primero agrega al inversionista a la whitelist (paso 4).");
      const r = await loadRwa();
      const { outcome } = await r.invest(session.contractId, session.investorSecret, SMALL);
      if (outcome.ok) throw new Error(`El contrato aceptó una inversión de ${SMALL}. Esto no debería pasar.`);
      // Solo el error #7 demuestra la regla; cualquier otro fallo se muestra y el paso queda pendiente.
      if (outcome.code !== 7) throw new Error(failureText(outcome));
      updateSession({ rejectedCode: outcome.code });
      focusStep(6);
    });

  const investOk = () =>
    run(6, async () => {
      if (!session.contractId || !session.investorSecret) throw new Error("Primero prueba la inversión chica (paso 5).");
      const r = await loadRwa();
      const { outcome, minted } = await r.invest(session.contractId, session.investorSecret, OK_AMOUNT, remember(6));
      settle(6, outcome, minted);
      focusStep(7);
    });

  const readBalance = () =>
    run(7, async () => {
      if (!session.contractId || !investor) throw new Error("Primero invierte (paso 6).");
      const r = await loadRwa();
      updateSession({ balance: (await r.getRwaBalance(session.contractId, investor)).toString() });
    });

  const reset = () => {
    if (window.confirm("¿Empezar de nuevo? Se olvidan las cuentas y el launchpad de esta prueba.")) {
      updateSession(null);
      setErrors({});
      focusStep(1);
    }
  };

  const done: Record<StepN, boolean> = {
    1: Boolean(admin && investor),
    2: Boolean(session.contractId),
    3: Boolean(session.initialized),
    4: Boolean(session.whitelistTx),
    5: session.rejectedCode === 7,
    6: Boolean(session.investTx),
    7: session.balance !== undefined,
  };
  const statusOf = (n: StepN): StepStatus => {
    if (done[n]) return "done";
    if (n === 1 || done[(n - 1) as StepN]) return "ready";
    return "locked";
  };
  const canAct = (n: StepN) => hydrated && statusOf(n) === "ready" && busy === null && !pending;
  // El balance se puede volver a leer las veces que haga falta.
  const canRead = hydrated && statusOf(7) !== "locked" && busy === null && !pending;
  const contractShort = session.contractId ? short(session.contractId) : "C…";
  const investorShort = investor ? short(investor) : "G…";
  const adminShort = admin ? short(admin) : "G…";
  const pendingNote = (step: PendingStep) =>
    pending?.step === step && (
      <ResultBox tone="info">
        Enviada a la red, esperando la confirmación… <TxLink hash={pending.hash} />
      </ResultBox>
    );
  const invoke = (who: string) => `stellar contract invoke --id ${contractShort} --source ${who} --network testnet --`;

  return (
    <div className="max-w-3xl">
      <ol className="flex flex-col gap-5" aria-label="Pasos de la demo">
        <Step
          n={1}
          title="Crear las cuentas de prueba"
          actor="Preparación"
          status={statusOf(1)}
          explanation={
            <>
              Dos cuentas nuevas: el <strong>admin</strong>, que emite el activo y decide quién puede invertir, y el{" "}
              <strong>inversionista</strong>. Friendbot, el servicio de la red de prueba, les regala 10.000 XLM a cada
              una. Sus llaves quedan guardadas solo en este navegador.
            </>
          }
          action={
            <ActionButton onClick={createAccounts} busy={busy === 1} disabled={!hydrated || busy !== null || Boolean(pending)}>
              {done[1] ? "Crear cuentas nuevas" : "Crear cuentas"}
            </ActionButton>
          }
          error={errors[1]}
          command={`stellar keys generate rwa-admin --network testnet --fund\nstellar keys generate rwa-inversor --network testnet --fund`}
        >
          {done[1] && admin && investor && (
            <ResultBox tone="ok">
              <p className="font-medium">Listo: dos cuentas con 10.000 XLM de prueba cada una.</p>
              <ul className="mt-2 space-y-1">
                <li>
                  Admin: <AddressLink address={admin} />
                </li>
                <li>
                  Inversionista: <AddressLink address={investor} />
                </li>
              </ul>
            </ResultBox>
          )}
        </Step>

        <Step
          n={2}
          title="Desplegar el launchpad"
          actor="Admin"
          status={statusOf(2)}
          explanation={
            <>
              El admin publica su propia copia del contrato de <code className="font-mono">dia-3</code>, con la regla
              de inversión mínima. Es el mismo código que desplegué con el CLI: una instancia nueva, con su propia
              dirección.
            </>
          }
          action={
            !done[2] && (
              <ActionButton onClick={deploy} busy={busy === 2} disabled={!canAct(2)}>
                Desplegar
              </ActionButton>
            )
          }
          error={errors[2]}
          command={`stellar contract deploy --wasm-hash ${RWA_WASM_HASH.slice(0, 8)}… \\\n  --source rwa-admin --network testnet`}
          txHash={session.deployTx}
        >
          {pendingNote(2)}
          {done[2] && session.contractId && (
            <ResultBox tone="ok">
              Launchpad desplegado en <AddressLink address={session.contractId} kind="contract" />. Todavía no tiene
              activo ni admin: eso lo define el paso siguiente.
            </ResultBox>
          )}
        </Step>

        <Step
          n={3}
          title="Inicializar el activo"
          actor="Admin"
          status={statusOf(3)}
          explanation={
            <>
              El admin define el activo: <strong>{RWA_ASSET.name}</strong>, con un precio de{" "}
              {RWA_ASSET.pricePerUnit.toString()} unidades del token de pago por cada RWA. El token de pago es el XLM de
              la red de prueba, y su unidad más chica es el stroop (0,0000001 XLM).
            </>
          }
          action={
            !done[3] && (
              <ActionButton onClick={initialize} busy={busy === 3} disabled={!canAct(3)}>
                Inicializar
              </ActionButton>
            )
          }
          error={errors[3]}
          command={`# scripts/admin-tool.sh initialize\n${invoke("rwa-admin")} initialize --admin ${adminShort} \\\n  --asset '{"name":"${RWA_ASSET.name}","total_supply":"${RWA_ASSET.totalSupply}","price_per_unit":"${RWA_ASSET.pricePerUnit}","payment_token":"${short(XLM_CONTRACT)}","paused":false}'`}
          txHash={session.initTx}
        >
          {pendingNote(3)}
          {done[3] && (
            <ResultBox tone="ok">
              Activo {RWA_ASSET.name} inicializado: {RWA_ASSET.pricePerUnit.toString()} unidades = 1 RWA, cobrando en XLM.
            </ResultBox>
          )}
        </Step>

        <Step
          n={4}
          title="Agregar al inversionista a la whitelist"
          actor="Admin"
          status={statusOf(4)}
          explanation={
            <>
              Solo invierte quien el admin aprobó. El contrato exige la firma del admin para cambiar la whitelist.
            </>
          }
          action={
            !done[4] && (
              <ActionButton onClick={whitelist} busy={busy === 4} disabled={!canAct(4)}>
                Aprobar al inversionista
              </ActionButton>
            )
          }
          error={errors[4]}
          command={`# scripts/admin-tool.sh whitelist\n${invoke("rwa-admin")} set_whitelist \\\n  --admin ${adminShort} --investor ${investorShort} --approved true`}
          txHash={session.whitelistTx}
        >
          {pendingNote(4)}
          {done[4] && <ResultBox tone="ok">El inversionista {investorShort} ya puede invertir.</ResultBox>}
        </Step>

        <Step
          n={5}
          title={`Invertir ${SMALL}`}
          actor="Inversionista"
          status={statusOf(5)}
          explanation={
            <>
              Ahora la regla: cada inversión tiene que ser de al menos {MIN_INVESTMENT.toString()} unidades del token de
              pago. Probemos con {units(SMALL)}.
            </>
          }
          action={
            !done[5] && (
              <ActionButton onClick={investSmall} busy={busy === 5} disabled={!canAct(5)}>
                Invertir {SMALL.toString()}
              </ActionButton>
            )
          }
          error={errors[5]}
          command={`# scripts/user-tool.sh invest ${SMALL}\n${invoke("rwa-inversor")} invest \\\n  --investor ${investorShort} --payment_amount ${SMALL}`}
        >
          {done[5] && session.rejectedCode !== undefined && (
            <ResultBox tone="bad">
              <p className="font-medium">{failureText({ code: session.rejectedCode, message: "" })}</p>
              <p className="mt-1">
                La red ni siquiera recibió la transacción: antes de enviarla se simula, y la simulación ya falló. No se
                cobró nada y el inversionista no recibió RWA.
              </p>
            </ResultBox>
          )}
        </Step>

        <Step
          n={6}
          title={`Invertir ${OK_AMOUNT}`}
          actor="Inversionista"
          status={statusOf(6)}
          explanation={
            <>
              Ahora con el mínimo, {units(OK_AMOUNT)}. El contrato cobra el pago y le da al inversionista{" "}
              {(OK_AMOUNT / RWA_ASSET.pricePerUnit).toString()} RWA ({OK_AMOUNT.toString()} ÷{" "}
              {RWA_ASSET.pricePerUnit.toString()}), todo en una sola operación.
            </>
          }
          action={
            !done[6] && (
              <ActionButton onClick={investOk} busy={busy === 6} disabled={!canAct(6)}>
                Invertir {OK_AMOUNT.toString()}
              </ActionButton>
            )
          }
          error={errors[6]}
          command={`# scripts/user-tool.sh invest ${OK_AMOUNT}\n${invoke("rwa-inversor")} invest \\\n  --investor ${investorShort} --payment_amount ${OK_AMOUNT}`}
          txHash={session.investTx}
        >
          {pendingNote(6)}
          {done[6] && (
            <ResultBox tone="ok">
              <p className="font-medium">
                Inversión aceptada: {units(OK_AMOUNT)} pasaron al contrato
                {session.minted ? ` y el inversionista recibió ${session.minted} RWA` : ""}.
              </p>
              <p className="mt-1">
                El contrato publicó el evento <code className="font-mono">invest</code>.
              </p>
            </ResultBox>
          )}
        </Step>

        <Step
          n={7}
          title="Consultar el balance"
          actor="Inversionista"
          status={statusOf(7)}
          explanation={<>Leemos de la red cuántos RWA tiene el inversionista. Es solo una lectura: no hay que firmar.</>}
          action={
            <ActionButton onClick={readBalance} busy={busy === 7} disabled={!canRead}>
              {done[7] ? "Consultar de nuevo" : "Consultar balance"}
            </ActionButton>
          }
          error={errors[7]}
          command={`# scripts/user-tool.sh balance\n${invoke("rwa-inversor")} balance --id ${investorShort}`}
        >
          {done[7] && (
            <ResultBox tone="ok">
              <p className="font-medium">Balance del inversionista: {session.balance} RWA.</p>
            </ResultBox>
          )}
        </Step>

        {done[7] && (
          <li className="rounded-2xl border border-accent bg-accent-soft p-5">
            <p className="font-semibold">¡Terminaste la demo!</p>
            <p className="mt-1 text-sm text-muted">
              La inversión de {SMALL.toString()} se rechazó con <code className="font-mono">AmountTooLow</code> y la de{" "}
              {OK_AMOUNT.toString()} se aceptó. Cualquiera puede verificarlo en el{" "}
              {session.contractId ? (
                <a
                  href={explorer.contract(session.contractId)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  explorador ↗
                </a>
              ) : (
                "explorador"
              )}
              .
            </p>
          </li>
        )}

        {hydrated && done[1] && (
          <li className="list-none">
            <button
              type="button"
              onClick={reset}
              disabled={busy !== null}
              className="text-sm text-muted underline decoration-dotted underline-offset-4 hover:text-text disabled:opacity-50"
            >
              Empezar de nuevo con cuentas nuevas
            </button>
          </li>
        )}
      </ol>
    </div>
  );
}
