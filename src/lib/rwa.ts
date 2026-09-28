// Lo que toca la red para el RWA Launchpad. Como stellar.ts, carga el SDK
// completo: la interfaz lo importa con `import()` recién cuando hace falta.
import { rpc } from "@stellar/stellar-sdk";
import { RwaLaunchpadClient, type AssetInfo } from "./rwa-contract.ts";
import { RPC_URL, XLM_CONTRACT } from "./deployment.ts";
import { RWA_ASSET, RWA_WASM_HASH } from "./rwa-deployment.ts";
import {
  NETWORK_PASSPHRASE,
  deployContract,
  failure,
  publicKeyOf,
  signerOptions,
  submit,
  type Deployment,
  type OnSubmitted,
  type TxOutcome,
} from "./stellar.ts";

function client(contractId: string, signerSecret?: string): RwaLaunchpadClient {
  return new RwaLaunchpadClient({
    contractId,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
    ...(signerSecret ? signerOptions(signerSecret) : {}),
  });
}

/** Despliega un launchpad nuevo. No tiene constructor: queda sin inicializar. */
export async function deployLaunchpad(adminSecret: string, onSubmitted?: OnSubmitted): Promise<Deployment> {
  return deployContract(RWA_WASM_HASH, null, adminSecret, onSubmitted);
}

/** `initialize` con el mismo activo que usa `admin-tool.sh`, cobrando en XLM nativo. */
export async function initializeLaunchpad(
  contractId: string,
  adminSecret: string,
  onSubmitted?: OnSubmitted,
): Promise<TxOutcome> {
  const asset: AssetInfo = {
    name: RWA_ASSET.name,
    total_supply: RWA_ASSET.totalSupply,
    price_per_unit: RWA_ASSET.pricePerUnit,
    payment_token: XLM_CONTRACT,
    paused: false,
  };
  try {
    const tx = await client(contractId, adminSecret).initialize({ admin: publicKeyOf(adminSecret), asset });
    return (await submit(tx, onSubmitted)).outcome;
  } catch (error) {
    return failure(error);
  }
}

export async function whitelistInvestor(
  contractId: string,
  adminSecret: string,
  investor: string,
  onSubmitted?: OnSubmitted,
): Promise<TxOutcome> {
  try {
    const tx = await client(contractId, adminSecret).set_whitelist({
      admin: publicKeyOf(adminSecret),
      investor,
      approved: true,
    });
    return (await submit(tx, onSubmitted)).outcome;
  } catch (error) {
    return failure(error);
  }
}

/** Invierte `amount` unidades del token de pago. `minted` son los RWA que recibió. */
export async function invest(
  contractId: string,
  investorSecret: string,
  amount: bigint,
  onSubmitted?: OnSubmitted,
): Promise<{ outcome: TxOutcome; minted: bigint | null }> {
  try {
    const tx = await client(contractId, investorSecret).invest({
      investor: publicKeyOf(investorSecret),
      payment_amount: amount,
    });
    const { outcome, sent } = await submit(tx, onSubmitted);
    return { outcome, minted: outcome.ok && sent ? sent.result : null };
  } catch (error) {
    return { outcome: failure(error), minted: null };
  }
}

/** Saldo de RWA de una cuenta. Lanza un error si no se puede leer. */
export async function getRwaBalance(contractId: string, id: string): Promise<bigint> {
  const tx = await client(contractId).balance({ id });
  if (tx.simulation && rpc.Api.isSimulationError(tx.simulation)) throw new Error(tx.simulation.error);
  return tx.result;
}
