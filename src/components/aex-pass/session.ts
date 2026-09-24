// Lo que la demo recuerda entre visitas, en localStorage. Es solo una caché:
// el estado real del pase se lee de la red. Las llaves son de cuentas de
// prueba (testnet) creadas para la demo; nunca se muestran ni se envían.
//
// Se expone como un store externo (`useSyncExternalStore`): cada escritura
// relee lo último guardado y le aplica el cambio, así dos pestañas abiertas no
// se pisan la sesión entera.

export type PendingTx = {
  step: 2 | 3 | 4;
  hash: string;
  /** Cuándo se envió (ms), para saber si ya venció. */
  at: number;
  eventName?: string;
  priceStroops?: string;
};

export type Session = {
  hostSecret?: string;
  hostPublic?: string;
  guestSecret?: string;
  guestPublic?: string;
  contractId?: string;
  eventName?: string;
  priceStroops?: string;
  deployTx?: string;
  deployFeeStroops?: string;
  deployLedger?: number;
  buyTx?: string;
  buyFeeStroops?: string;
  checkInTx?: string;
  checkInFeeStroops?: string;
  retry?: { code: number; message: string };
  pending?: PendingTx;
};

const STORAGE_KEY = "aex-pass:sesion:v2";
const LEGACY_KEY = "aex-pass:sesion:v1";
const EMPTY: Session = {};

const listeners = new Set<() => void>();
// Si el navegador bloquea localStorage (modo privado estricto), la sesión vive
// solo en memoria: la demo funciona igual, pero no se recuerda al recargar.
let memory: string | null = null;
let cache: { raw: string | null; value: Session } = { raw: null, value: EMPTY };

function getItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return key === STORAGE_KEY ? memory : null;
  }
}

function parse(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null; // Una sesión corrupta se descarta y la demo empieza de cero.
  }
}

const str = (value: unknown) => (typeof value === "string" && value ? value : undefined);

// La v1 guardaba las comisiones ya formateadas ("0.0109140") y no guardaba las
// direcciones públicas. Se conserva lo que sigue sirviendo.
function fromLegacy(v1: Record<string, unknown>): Session {
  return {
    hostSecret: str(v1.hostSecret),
    guestSecret: str(v1.guestSecret),
    contractId: str(v1.contractId),
    eventName: str(v1.eventName),
    priceStroops: str(v1.priceStroops),
    deployTx: str(v1.deployTx),
    deployLedger: typeof v1.deployLedger === "number" ? v1.deployLedger : undefined,
    buyTx: str(v1.buyTx),
    checkInTx: str(v1.checkInTx),
  };
}

export function getSession(): Session {
  const raw = getItem(STORAGE_KEY) ?? getItem(LEGACY_KEY);
  if (raw === cache.raw) return cache.value;
  const current = parse(getItem(STORAGE_KEY));
  const legacy = current ? null : parse(getItem(LEGACY_KEY));
  cache = { raw, value: current ? (current as Session) : legacy ? fromLegacy(legacy) : EMPTY };
  return cache.value;
}

export function getServerSession(): Session {
  return EMPTY;
}

export function subscribeSession(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Aplica un cambio sobre lo último guardado. `null` borra la sesión. */
export function updateSession(patch: Session | null) {
  const next = patch === null ? EMPTY : { ...getSession(), ...patch };
  const raw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, raw);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    memory = raw;
  }
  listeners.forEach((listener) => listener());
}
