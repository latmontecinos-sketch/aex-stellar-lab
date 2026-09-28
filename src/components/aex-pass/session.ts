// La sesión de la demo de Aex Pass (ver local-store.ts).
import { createLocalStore } from "@/components/local-store";

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

const store = createLocalStore<Session>("aex-pass:sesion:v2", {}, { key: "aex-pass:sesion:v1", migrate: fromLegacy });

export const {
  get: getSession,
  getServer: getServerSession,
  subscribe: subscribeSession,
  update: updateSession,
} = store;
