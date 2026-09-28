// La sesión de la demo del RWA Launchpad (ver local-store.ts).
import { createLocalStore } from "@/components/local-store";

export type PendingStep = 2 | 3 | 4 | 6;

export type PendingTx = {
  step: PendingStep;
  hash: string;
  /** Cuándo se envió (ms), para saber si ya venció. */
  at: number;
};

export type Session = {
  adminSecret?: string;
  adminPublic?: string;
  investorSecret?: string;
  investorPublic?: string;
  contractId?: string;
  deployTx?: string;
  initialized?: boolean;
  initTx?: string;
  whitelistTx?: string;
  /** Código con que el contrato rechazó la inversión chica. */
  rejectedCode?: number;
  investTx?: string;
  /** RWA recibidos por la inversión, en texto porque JSON no guarda bigint. */
  minted?: string;
  balance?: string;
  pending?: PendingTx;
};

const store = createLocalStore<Session>("rwa-launchpad:sesion:v1", {});

export const {
  get: getSession,
  getServer: getServerSession,
  subscribe: subscribeSession,
  update: updateSession,
} = store;
