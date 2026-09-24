// Todo lo que toca la red Stellar. Solo testnet: las cuentas y el XLM son de prueba.
// Este módulo carga el SDK completo, así que la interfaz lo importa con `import()`
// recién cuando hace falta.
import { Horizon, Keypair, Networks, contract, rpc, scValToNative } from "@stellar/stellar-sdk";
import { AexPassClient, type DeployArgs } from "./aex-pass-contract.ts";
import { FRIENDBOT_URL, HORIZON_URL, RPC_URL, WASM_HASH, XLM_CONTRACT, contractError } from "./deployment.ts";
import { stroopsFromDecimal } from "./format.ts";

// La red es fija. No hay entrada del usuario que pueda cambiarla, y este módulo
// nunca debe apuntar a mainnet: firma con llaves guardadas en el navegador.
const NETWORK_PASSPHRASE = Networks.TESTNET;

export type PassStatus = "none" | "bought" | "used";
export type Account = { publicKey: string; secret: string };

export type TxOutcome =
  | { ok: true; hash: string; feeStroops: bigint | null }
  | {
      ok: false;
      /** Código del error del contrato (#1…#4), si fue el contrato el que rechazó. */
      code: number | null;
      message: string;
      /** Hash de la transacción, si llegó a enviarse. */
      hash?: string;
      /** La red recibió la transacción pero todavía no la confirma. */
      pending?: boolean;
    };

/** El resultado de una lectura: o el dato, o por qué no se pudo leer. */
export type Read<T> = { ok: true; value: T } | { ok: false; message: string };

export type ContractEvent = {
  id: string;
  name: string;
  buyer: string;
  price: bigint | null;
  ledger: number;
  txHash: string;
};

/** Se llama con el hash apenas la transacción está firmada, antes de esperar la confirmación. */
export type OnSubmitted = (hash: string) => void;

const server = new rpc.Server(RPC_URL);
const horizon = new Horizon.Server(HORIZON_URL);

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function signerOptions(secret: string) {
  const keypair = Keypair.fromSecret(secret);
  return { publicKey: keypair.publicKey(), ...contract.basicNodeSigner(keypair, NETWORK_PASSPHRASE) };
}

function client(contractId: string, signerSecret?: string): AexPassClient {
  return new AexPassClient({
    contractId,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
    ...(signerSecret ? signerOptions(signerSecret) : {}),
  });
}

function failure(error: unknown, hash?: string): Extract<TxOutcome, { ok: false }> {
  const message = messageOf(error);
  const match = /Error\(Contract, #(\d+)\)/.exec(message);
  const code = match ? Number(match[1]) : null;
  return { ok: false, code, message: contractError(code)?.meaning ?? message, hash };
}

/** Crea una cuenta nueva y le pide XLM de prueba a Friendbot. */
export async function createFundedAccount(): Promise<Account> {
  const keypair = Keypair.random();
  const res = await fetch(`${FRIENDBOT_URL}/?addr=${keypair.publicKey()}`);
  if (!res.ok) throw new Error("Friendbot no pudo fondear la cuenta. Intenta de nuevo en unos segundos.");
  return { publicKey: keypair.publicKey(), secret: keypair.secret() };
}

export function publicKeyOf(secret: string): string {
  return Keypair.fromSecret(secret).publicKey();
}

/** Saldo en XLM nativo, en stroops. */
export async function getXlmBalance(address: string): Promise<Read<bigint>> {
  try {
    const account = await horizon.loadAccount(address);
    const native = account.balances.find((b) => b.asset_type === "native");
    if (!native) return { ok: false, message: "La cuenta no tiene saldo en XLM." };
    return { ok: true, value: stroopsFromDecimal(native.balance) };
  } catch (error) {
    return { ok: false, message: messageOf(error) };
  }
}

async function feeOf(hash: string): Promise<bigint | null> {
  // Horizon puede ir unos segundos detrás del RPC: si todavía no la tiene, la
  // comisión queda sin mostrar, pero la transacción sí está confirmada.
  try {
    const tx = await horizon.transactions().transaction(hash).call();
    return BigInt(tx.fee_charged);
  } catch {
    return null;
  }
}

/**
 * Firma, envía y espera la confirmación. Solo cuenta como hecha si la red
 * responde SUCCESS: que el SDK no lance error no alcanza.
 */
async function submit<T>(
  tx: contract.AssembledTransaction<T>,
  onSubmitted?: OnSubmitted,
): Promise<{ outcome: TxOutcome; sent?: contract.SentTransaction<T> }> {
  // Si la simulación falla, la transacción nunca se envía a la red.
  if (tx.simulation && rpc.Api.isSimulationError(tx.simulation)) {
    return { outcome: failure(tx.simulation.error) };
  }
  let hash: string | undefined;
  try {
    await tx.sign();
    const signedHash = tx.signed?.hash();
    // `hash()` devuelve bytes; Buffer no existe en el navegador.
    hash = signedHash ? Array.from(signedHash, (b) => b.toString(16).padStart(2, "0")).join("") : undefined;
    if (hash) onSubmitted?.(hash);
    const sent = await tx.send();
    const response = sent.getTransactionResponse;
    hash = hash ?? sent.sendTransactionResponse?.hash;
    if (response?.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
      return {
        outcome: {
          ok: false,
          code: null,
          message: "La red recibió la transacción, pero falló al aplicarse.",
          hash,
        },
      };
    }
    return { outcome: { ok: true, hash: response.txHash, feeStroops: await feeOf(response.txHash) }, sent };
  } catch (error) {
    if (error instanceof contract.SentTransaction.Errors.TransactionStillPending) {
      return {
        outcome: {
          ok: false,
          code: null,
          message: "La red todavía no confirma la transacción. Recarga en un minuto para ver si entró.",
          hash,
          pending: true,
        },
      };
    }
    return { outcome: failure(error, hash) };
  }
}

/** Despliega una instancia nueva del contrato: un evento con su anfitrión, precio y nombre. */
export async function deployEvent(
  hostSecret: string,
  name: string,
  priceStroops: bigint,
  onSubmitted?: OnSubmitted,
): Promise<{ contractId: string; outcome: TxOutcome; ledger: number | null }> {
  const signer = signerOptions(hostSecret);
  const args: DeployArgs = { host: signer.publicKey, token: XLM_CONTRACT, price: priceStroops, name };
  try {
    const tx = await contract.Client.deploy<contract.Client>(args, {
      wasmHash: WASM_HASH,
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
      ...signer,
    });
    const { outcome, sent } = await submit(tx, onSubmitted);
    if (!outcome.ok || !sent) return { contractId: "", outcome, ledger: null };
    const response = sent.getTransactionResponse;
    return {
      contractId: sent.result.options.contractId,
      outcome,
      ledger: response?.status === rpc.Api.GetTransactionStatus.SUCCESS ? response.ledger : null,
    };
  } catch (error) {
    return { contractId: "", outcome: failure(error), ledger: null };
  }
}

export async function buyPass(contractId: string, buyerSecret: string, onSubmitted?: OnSubmitted): Promise<TxOutcome> {
  try {
    const buyer = publicKeyOf(buyerSecret);
    return (await submit(await client(contractId, buyerSecret).buy({ buyer }), onSubmitted)).outcome;
  } catch (error) {
    return failure(error);
  }
}

export async function checkIn(
  contractId: string,
  hostSecret: string,
  buyer: string,
  onSubmitted?: OnSubmitted,
): Promise<TxOutcome> {
  try {
    return (await submit(await client(contractId, hostSecret).check_in({ buyer }), onSubmitted)).outcome;
  } catch (error) {
    return failure(error);
  }
}

export type TxResolution =
  | { status: "success"; ledger: number; feeStroops: bigint | null; returned: unknown }
  | { status: "failed" }
  | { status: "not_found" };

/**
 * Qué pasó con una transacción enviada antes, por ejemplo si la página se cerró
 * mientras esperaba. `returned` es lo que devolvió; en un despliegue, la
 * dirección del contrato nuevo.
 */
export async function resolveTx(hash: string): Promise<TxResolution> {
  const res = await server.getTransaction(hash);
  if (res.status === rpc.Api.GetTransactionStatus.SUCCESS) {
    return {
      status: "success",
      ledger: res.ledger,
      feeStroops: await feeOf(hash),
      returned: res.returnValue ? (scValToNative(res.returnValue) as unknown) : null,
    };
  }
  if (res.status === rpc.Api.GetTransactionStatus.FAILED) return { status: "failed" };
  return { status: "not_found" };
}

/** Lanza un error si no se puede leer: quien llama decide cómo mostrarlo. */
export async function getPassStatus(contractId: string, buyer: string): Promise<PassStatus> {
  const tx = await client(contractId).pass_of({ buyer });
  if (tx.simulation && rpc.Api.isSimulationError(tx.simulation)) throw new Error(tx.simulation.error);
  const tag = tx.result?.tag;
  if (tag === "Bought") return "bought";
  if (tag === "Used") return "used";
  return "none";
}

function decodeEvent(event: rpc.Api.EventResponse): ContractEvent {
  const topics = event.topic.map((t) => scValToNative(t) as unknown);
  const data = scValToNative(event.value) as unknown;
  const price =
    data !== null && typeof data === "object" && "price" in data && typeof data.price === "bigint" ? data.price : null;
  return {
    id: event.id,
    name: String(topics[0]),
    buyer: String(topics[1] ?? ""),
    price,
    ledger: event.ledger,
    txHash: event.txHash,
  };
}

// El RPC revisa como mucho unos 10.000 ledgers por consulta y solo guarda los
// últimos 7 días. El cursor dice hasta qué ledger revisó.
function ledgerOfCursor(cursor: string): number {
  return Number(BigInt(cursor.split("-")[0]) >> 32n);
}

/**
 * Eventos publicados por el contrato (`bought` y `checked_in`), recorriendo
 * todas las páginas desde `fromLedger`. `truncated` avisa si parte de ese
 * rango ya salió de la ventana que guarda el RPC.
 */
export async function getContractEvents(
  contractId: string,
  fromLedger: number,
): Promise<Read<{ events: ContractEvent[]; truncated: boolean }>> {
  const filters: rpc.Api.EventFilter[] = [{ type: "contract", contractIds: [contractId] }];
  const limit = 100;
  try {
    const { oldestLedger } = await server.getHealth();
    const events: ContractEvent[] = [];
    let res = await server.getEvents({ startLedger: Math.max(fromLedger, oldestLedger), filters, limit });
    // Tope de páginas por si el RPC dejara de avanzar el cursor.
    for (let page = 0; page < 30; page++) {
      events.push(...res.events.map(decodeEvent));
      const reachedEnd = res.events.length < limit && ledgerOfCursor(res.cursor) >= res.latestLedger;
      if (reachedEnd || !res.cursor) break;
      res = await server.getEvents({ cursor: res.cursor, filters, limit });
    }
    return { ok: true, value: { events, truncated: fromLedger < oldestLedger } };
  } catch (error) {
    return { ok: false, message: messageOf(error) };
  }
}

export async function latestLedger(): Promise<number> {
  return (await server.getLatestLedger()).sequence;
}
