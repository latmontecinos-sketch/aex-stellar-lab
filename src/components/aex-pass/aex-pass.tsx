"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { TxOutcome, TxResolution } from "@/lib/stellar";
import { TTL_DAYS, WASM_HASH, XLM_CONTRACT, contractError, explorer } from "@/lib/deployment";
import { formatXlm, parseXlm, short } from "@/lib/format";
import { AddressLink, ResultBox, Term, TxLink } from "@/components/ui";
import { EMPTY_LIVE, LivePanel, type Live } from "./live-panel";
import { ActionButton, Step, type StepStatus } from "./step";
import {
  getServerSession,
  getSession,
  subscribeSession,
  updateSession,
  type PendingTx,
  type Session,
} from "./session";

// El SDK de Stellar pesa ~140 KB comprimido: se descarga recién cuando la demo
// lo necesita, no al abrir la página.
const loadStellar = () => import("@/lib/stellar");

const MAX_PRICE_STROOPS = 1_000_000_000n; // 100 XLM
// El SDK arma las transacciones con 5 minutos de validez: pasado ese plazo, una
// transacción que la red no encuentra ya no va a entrar.
const PENDING_EXPIRY_MS = 5 * 60_000;
const PENDING_RECHECK_MS = 10_000;

type Failure = Extract<TxOutcome, { ok: false }>;

function failureText(outcome: Failure): string {
  const error = contractError(outcome.code);
  if (error) return `El contrato lo rechazó: ${error.meaning} (error #${outcome.code}, ${error.name}).`;
  return `No se pudo completar: ${outcome.message}`;
}

function stroops(value?: string): bigint | null {
  return value && /^\d+$/.test(value) ? BigInt(value) : null;
}

function feeText(value?: string) {
  const fee = stroops(value);
  return fee === null ? null : `${formatXlm(fee)} XLM`;
}

function priceProblem(price: bigint | null): string | null {
  if (price === null) return "Escribe un monto como 1 o 0,5 (hasta 7 decimales).";
  if (price <= 0n) return "El precio tiene que ser mayor a cero.";
  if (price > MAX_PRICE_STROOPS) return "Para la prueba, usa un precio de hasta 100 XLM.";
  return null;
}

/** Lo que se guarda cuando una transacción se confirma, venga del botón o de recuperarla al volver. */
function confirmedPatch(pending: PendingTx, fee: bigint | null, extra: { contractId?: string; ledger?: number }): Session {
  const feeStroops = fee?.toString();
  if (pending.step === 2) {
    return {
      pending: undefined,
      contractId: extra.contractId,
      eventName: pending.eventName,
      priceStroops: pending.priceStroops,
      deployTx: pending.hash,
      deployFeeStroops: feeStroops,
      deployLedger: extra.ledger,
    };
  }
  if (pending.step === 3) return { pending: undefined, buyTx: pending.hash, buyFeeStroops: feeStroops };
  return { pending: undefined, checkInTx: pending.hash, checkInFeeStroops: feeStroops };
}

const noopSubscribe = () => () => {};

export function AexPass() {
  const session = useSyncExternalStore(subscribeSession, getSession, getServerSession);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [busy, setBusy] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [live, setLive] = useState<Live>(EMPTY_LIVE);
  const [refreshing, setRefreshing] = useState(false);
  const [recheck, setRecheck] = useState(0);
  const [eventName, setEventName] = useState("Meet de prueba");
  const [priceXlm, setPriceXlm] = useState("1");
  const refreshSeq = useRef(0);

  const host = session.hostPublic ?? null;
  const guest = session.guestPublic ?? null;
  const price = stroops(session.priceStroops);
  const typedPrice = parseXlm(priceXlm);
  const typedPriceProblem = priceProblem(typedPrice);

  const setError = (step: number, message: string) => setErrors((prev) => ({ ...prev, [step]: message }));

  // Sesiones de la versión anterior: guardaban solo las llaves secretas.
  useEffect(() => {
    const { hostSecret, guestSecret } = session;
    if (!hostSecret || !guestSecret || (session.hostPublic && session.guestPublic)) return;
    void loadStellar().then((s) =>
      updateSession({ hostPublic: s.publicKeyOf(hostSecret), guestPublic: s.publicKeyOf(guestSecret) }),
    );
  }, [session]);

  const refresh = useCallback(async () => {
    if (!host || !guest) return;
    const seq = ++refreshSeq.current;
    const contractId = session.contractId;
    const s = await loadStellar();
    if (seq !== refreshSeq.current) return;
    setRefreshing(true);
    const [hostBalance, guestBalance, pass, events] = await Promise.all([
      s.getXlmBalance(host),
      s.getXlmBalance(guest),
      contractId
        ? s.getPassStatus(contractId, guest).then(
            (value) => ({ ok: true as const, value }),
            (error: unknown) => ({ ok: false as const, message: String(error) }),
          )
        : Promise.resolve(null),
      contractId ? s.getContractEvents(contractId, session.deployLedger ?? 0) : Promise.resolve(null),
    ]);
    // Si mientras tanto empezó otra lectura, esta respuesta ya es vieja.
    if (seq !== refreshSeq.current) return;
    setLive({ contractId, pass, hostBalance, guestBalance, events, updatedAt: new Date() });
    setRefreshing(false);
  }, [host, guest, session.contractId, session.deployLedger]);

  useEffect(() => {
    if (hydrated) void refresh();
  }, [hydrated, refresh]);

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
        updateSession(
          confirmedPatch(pending, res.feeStroops, {
            contractId: typeof res.returned === "string" ? res.returned : undefined,
            ledger: res.ledger,
          }),
        );
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

  async function run(step: number, action: () => Promise<void>) {
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
  const remember = (step: PendingTx["step"], extra?: Pick<PendingTx, "eventName" | "priceStroops">) => (hash: string) =>
    updateSession({ pending: { step, hash, at: Date.now(), ...extra } });

  /** Resuelve el resultado de un envío: confirmado, todavía pendiente o fallido. */
  function settle(outcome: TxOutcome, onConfirmed: (hash: string, fee: bigint | null) => void) {
    if (outcome.ok) {
      onConfirmed(outcome.hash, outcome.feeStroops);
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
      const [h, g] = await Promise.all([s.createFundedAccount(), s.createFundedAccount()]);
      updateSession(null);
      updateSession({ hostSecret: h.secret, hostPublic: h.publicKey, guestSecret: g.secret, guestPublic: g.publicKey });
      setErrors({});
      setLive(EMPTY_LIVE);
      focusStep(2);
    });

  const createEvent = () =>
    run(2, async () => {
      if (!session.hostSecret) throw new Error("Primero crea las cuentas (paso 1).");
      if (typedPriceProblem || typedPrice === null) throw new Error(typedPriceProblem ?? "Precio inválido.");
      const name = eventName.trim() || "Meet de prueba";
      const extra = { eventName: name, priceStroops: typedPrice.toString() };
      const s = await loadStellar();
      const result = await s.deployEvent(session.hostSecret, name, typedPrice, remember(2, extra));
      settle(result.outcome, (hash, fee) =>
        updateSession(
          confirmedPatch({ step: 2, hash, at: 0, ...extra }, fee, {
            contractId: result.contractId,
            ledger: result.ledger ?? undefined,
          }),
        ),
      );
      focusStep(3);
    });

  const buy = () =>
    run(3, async () => {
      if (!session.contractId || !session.guestSecret) throw new Error("Primero crea el evento (paso 2).");
      const s = await loadStellar();
      const outcome = await s.buyPass(session.contractId, session.guestSecret, remember(3));
      if (!outcome.ok && outcome.code === 2) {
        // Ya estaba comprado (por ejemplo, la compra entró pero la página no se enteró).
        updateSession({ pending: undefined });
        await refresh();
        focusStep(4);
        return;
      }
      settle(outcome, (hash, fee) => updateSession(confirmedPatch({ step: 3, hash, at: 0 }, fee, {})));
      await refresh();
      focusStep(4);
    });

  const letIn = () =>
    run(4, async () => {
      if (!session.contractId || !session.hostSecret || !guest) throw new Error("Primero compra el pase (paso 3).");
      const s = await loadStellar();
      const outcome = await s.checkIn(session.contractId, session.hostSecret, guest, remember(4));
      if (!outcome.ok && outcome.code === 4) {
        // El pase ya figuraba como usado: el check-in ya había entrado.
        updateSession({ pending: undefined });
        await refresh();
        focusStep(5);
        return;
      }
      settle(outcome, (hash, fee) => updateSession(confirmedPatch({ step: 4, hash, at: 0 }, fee, {})));
      await refresh();
      focusStep(5);
    });

  const tryAgain = () =>
    run(5, async () => {
      if (!session.contractId || !session.hostSecret || !guest) throw new Error("Primero deja entrar al invitado (paso 4).");
      const s = await loadStellar();
      const outcome = await s.checkIn(session.contractId, session.hostSecret, guest);
      if (outcome.ok) throw new Error("El contrato aceptó un segundo ingreso. Esto no debería pasar.");
      // Solo el error #4 demuestra la regla; cualquier otro fallo (sin red, contrato
      // archivado) se muestra como error y el paso queda pendiente.
      if (outcome.code !== 4) throw new Error(failureText(outcome));
      updateSession({ retry: { code: outcome.code, message: outcome.message } });
    });

  const reset = () => {
    if (window.confirm("¿Empezar de nuevo? Se olvidan las cuentas y el evento de esta prueba.")) {
      updateSession(null);
      setErrors({});
      setLive(EMPTY_LIVE);
      focusStep(1);
    }
  };

  const livePass = live.contractId && live.contractId === session.contractId && live.pass?.ok ? live.pass.value : null;
  const done = {
    1: Boolean(host && guest),
    2: Boolean(session.contractId),
    3: Boolean(session.buyTx) || livePass === "bought" || livePass === "used",
    4: Boolean(session.checkInTx) || livePass === "used",
    5: Boolean(session.retry),
  };
  const statusOf = (n: 1 | 2 | 3 | 4 | 5): StepStatus => {
    if (done[n]) return "done";
    if (n === 1 || done[(n - 1) as 1 | 2 | 3 | 4]) return "ready";
    return "locked";
  };
  const canAct = (n: 1 | 2 | 3 | 4 | 5) => hydrated && statusOf(n) === "ready" && busy === null && !pending;
  const priceLabel = `${price !== null ? formatXlm(price) : typedPrice !== null ? formatXlm(typedPrice) : priceXlm} XLM`;
  const who = { guest: guest ? short(guest) : "G…" };
  const contractShort = session.contractId ? short(session.contractId) : "C…";
  const pendingNote = (step: PendingTx["step"]) =>
    pending?.step === step && (
      <ResultBox tone="info">
        Enviada a la red, esperando la confirmación… <TxLink hash={pending.hash} />
      </ResultBox>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <ol className="flex flex-col gap-5" aria-label="Pasos de la demo">
        <Step
          n={1}
          title="Crear las cuentas de prueba"
          actor="Preparación"
          status={statusOf(1)}
          explanation={
            <>
              En Stellar, una <Term>cuenta</Term> es una dirección pública que empieza con G, más una llave
              secreta que sirve para <Term>firmar</Term>. Creamos dos: el <strong>anfitrión</strong>, que organiza
              el Meet, y el <strong>invitado</strong>, que quiere entrar. Friendbot, el servicio de la red de
              prueba, les regala 10.000 XLM a cada una. Sus llaves quedan guardadas solo en este navegador.
            </>
          }
          action={
            <ActionButton onClick={createAccounts} busy={busy === 1} disabled={!hydrated || busy !== null || Boolean(pending)}>
              {done[1] ? "Crear cuentas nuevas" : "Crear cuentas"}
            </ActionButton>
          }
          error={errors[1]}
          command={`stellar keys generate anfitrion --network testnet --fund\nstellar keys generate invitado --network testnet --fund`}
        >
          {done[1] && host && guest && (
            <ResultBox tone="ok">
              <p className="font-medium">Listo: dos cuentas con 10.000 XLM de prueba cada una.</p>
              <ul className="mt-2 space-y-1">
                <li>
                  Anfitrión: <AddressLink address={host} />
                </li>
                <li>
                  Invitado: <AddressLink address={guest} />
                </li>
              </ul>
            </ResultBox>
          )}
        </Step>

        <Step
          n={2}
          title="Crear el evento"
          actor="Anfitrión"
          status={statusOf(2)}
          explanation={
            <>
              El anfitrión publica un <Term>contrato</Term> con las reglas de su evento: quién cobra, cuánto
              cuesta el pase y cómo se llama. Desde ese momento las reglas viven en la blockchain y nadie puede
              cambiarlas, ni siquiera él.
            </>
          }
          action={
            !done[2] && (
              <div className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted">Nombre del evento</span>
                    <input
                      value={eventName}
                      maxLength={40}
                      onChange={(e) => setEventName(e.target.value)}
                      className="h-11 rounded-xl border border-border bg-bg px-3 text-text outline-none focus:border-accent"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted">Precio (XLM)</span>
                    <input
                      value={priceXlm}
                      inputMode="decimal"
                      maxLength={20}
                      aria-invalid={Boolean(typedPriceProblem)}
                      aria-describedby="precio-ayuda"
                      onChange={(e) => setPriceXlm(e.target.value)}
                      className="h-11 rounded-xl border border-border bg-bg px-3 text-text outline-none focus:border-accent aria-[invalid=true]:border-bad"
                    />
                  </label>
                </div>
                {typedPriceProblem && (
                  <p id="precio-ayuda" className="text-sm text-bad">
                    {typedPriceProblem}
                  </p>
                )}
                <ActionButton onClick={createEvent} busy={busy === 2} disabled={!canAct(2) || Boolean(typedPriceProblem)}>
                  Crear evento
                </ActionButton>
              </div>
            )
          }
          error={errors[2]}
          command={`stellar contract deploy --wasm-hash ${WASM_HASH.slice(0, 8)}… \\\n  --source-account anfitrion --network testnet \\\n  -- --host anfitrion --token ${short(XLM_CONTRACT)} \\\n  --price ${session.priceStroops ?? typedPrice?.toString() ?? "…"} --name "${session.eventName ?? eventName}"`}
          txHash={session.deployTx}
        >
          {pendingNote(2)}
          {done[2] && session.contractId && (
            <ResultBox tone="ok">
              <p className="font-medium">
                Evento creado: «{session.eventName}», con pase de {priceLabel}.
              </p>
              <p className="mt-1">
                Su contrato vive en la dirección <AddressLink address={session.contractId} kind="contract" />.
                {feeText(session.deployFeeStroops) && <> Comisión de la red: {feeText(session.deployFeeStroops)}.</>}
              </p>
            </ResultBox>
          )}
        </Step>

        <Step
          n={3}
          title="Comprar el pase"
          actor="Invitado"
          status={statusOf(3)}
          explanation={
            <>
              El invitado firma la compra. En una sola operación, el contrato le cobra {priceLabel}, se lo paga
              al anfitrión y anota que esta cuenta tiene pase. Si alguna parte falla, no pasa nada: ni se cobra
              ni se anota.
            </>
          }
          action={
            !done[3] && (
              <ActionButton onClick={buy} busy={busy === 3} disabled={!canAct(3)}>
                Comprar pase ({priceLabel})
              </ActionButton>
            )
          }
          error={errors[3]}
          command={`stellar contract invoke --id ${contractShort} --source-account invitado \\\n  --network testnet -- buy --buyer ${who.guest}`}
          txHash={session.buyTx}
        >
          {pendingNote(3)}
          {done[3] && (
            <ResultBox tone="ok">
              {session.buyTx ? (
                <>
                  <p className="font-medium">Pase comprado: {priceLabel} pasaron del invitado al anfitrión.</p>
                  <p className="mt-1">
                    El contrato anotó el pase como <strong>Comprado</strong> y publicó el <Term>evento</Term>{" "}
                    <code className="font-mono">bought</code>.
                    {feeText(session.buyFeeStroops) && (
                      <>
                        {" "}
                        Comisión de la red: {feeText(session.buyFeeStroops)}; incluye la renta por guardar el pase en
                        la red durante {TTL_DAYS} días.
                      </>
                    )}
                  </p>
                </>
              ) : (
                <p className="font-medium">La red confirma que el invitado ya tiene su pase.</p>
              )}
            </ResultBox>
          )}
        </Step>

        <Step
          n={4}
          title="Dejar entrar al Meet"
          actor="Anfitrión"
          status={statusOf(4)}
          explanation={
            <>
              En la puerta del Meet, el anfitrión marca el pase como usado. Solo él puede hacerlo: el contrato
              exige su firma, y su dirección la saca de sus propias reglas, así que nadie puede hacerse pasar por
              él.
            </>
          }
          action={
            !done[4] && (
              <ActionButton onClick={letIn} busy={busy === 4} disabled={!canAct(4)}>
                Dejar entrar
              </ActionButton>
            )
          }
          error={errors[4]}
          command={`stellar contract invoke --id ${contractShort} --source-account anfitrion \\\n  --network testnet -- check_in --buyer ${who.guest}`}
          txHash={session.checkInTx}
        >
          {pendingNote(4)}
          {done[4] && (
            <ResultBox tone="ok">
              <p className="font-medium">Entrada registrada: el pase ahora figura como Usado.</p>
              <p className="mt-1">
                El contrato publicó el evento <code className="font-mono">checked_in</code>.
                {feeText(session.checkInFeeStroops) && <> Comisión de la red: {feeText(session.checkInFeeStroops)}.</>}
              </p>
            </ResultBox>
          )}
        </Step>

        <Step
          n={5}
          title="Intentar entrar otra vez"
          actor="Anfitrión"
          status={statusOf(5)}
          explanation={<>¿Y si alguien intenta reutilizar el mismo pase? Probemos exactamente el mismo check-in otra vez.</>}
          action={
            !done[5] && (
              <ActionButton onClick={tryAgain} busy={busy === 5} disabled={!canAct(5)}>
                Intentar entrar de nuevo
              </ActionButton>
            )
          }
          error={errors[5]}
          command={`stellar contract invoke --id ${contractShort} --source-account anfitrion \\\n  --network testnet -- check_in --buyer ${who.guest}`}
        >
          {done[5] && session.retry && (
            <ResultBox tone="bad">
              <p className="font-medium">
                Rechazado: {failureText({ ok: false, code: session.retry.code, message: session.retry.message })}
              </p>
              <p className="mt-1">
                La red ni siquiera recibió la transacción: antes de enviarla se <Term>simula</Term>, y la
                simulación ya falló. Esa es la garantía: un pase se usa una sola vez, y lo asegura el contrato, no
                una persona.
              </p>
            </ResultBox>
          )}
        </Step>

        {done[5] && (
          <li className="rounded-2xl border border-accent bg-accent-soft p-5">
            <p className="font-semibold">¡Terminaste la demo!</p>
            <p className="mt-1 text-sm text-muted">
              Viste las dos reglas del contrato en acción: solo entra quien compró su pase, y cada pase se usa una
              sola vez. Todo quedó registrado en la blockchain y cualquiera puede verificarlo en el{" "}
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

      <LivePanel
        live={live}
        hasAccounts={done[1]}
        hasContract={done[2]}
        host={host}
        guest={guest}
        contractId={session.contractId}
        refreshing={refreshing}
        onRefresh={() => void refresh()}
      />
    </div>
  );
}
