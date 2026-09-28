// Cliente tipado del RWA Launchpad (dia-3 del bootcamp, con la regla de inversión mínima).
// Generado con `stellar contract bindings typescript --wasm rwa_launchpad_dia_3.wasm`
// (Stellar CLI 28) y recortado: sin re-exports del SDK ni polyfill de Buffer.
// El spec va embebido. Si el contrato cambia, hay que regenerar este archivo.
import { contract } from "@stellar/stellar-sdk";

type AssembledTransaction<T> = contract.AssembledTransaction<T>;
type MethodOptions = contract.MethodOptions;
type i128 = contract.i128;

export interface AssetInfo {
  name: string;
  paused: boolean;
  payment_token: string;
  price_per_unit: i128;
  total_supply: i128;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RwaLaunchpadClient {
  initialize: (args: { admin: string; asset: AssetInfo }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
  set_whitelist: (
    args: { admin: string; investor: string; approved: boolean },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<null>>;
  invest: (args: { investor: string; payment_amount: i128 }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
  balance: (args: { id: string }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
}

export const RWA_LAUNCHPAD_SPEC = new contract.Spec([
  "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABwAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAgAAAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAADAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAABAAAAAAAAAAOTm90V2hpdGVsaXN0ZWQAAAAAAAUAAAAAAAAABlBhdXNlZAAAAAAABgAAAAAAAAAMQW1vdW50VG9vTG93AAAABw==",
  "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJQXNzZXRJbmZvAAAAAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAEAAAAAAAAAC1doaXRlbGlzdGVkAAAAAAEAAAAT",
  "AAAAAQAAAAAAAAAAAAAACUFzc2V0SW5mbwAAAAAAAAUAAAAAAAAABG5hbWUAAAARAAAAAAAAAAZwYXVzZWQAAAAAAAEAAAAAAAAADXBheW1lbnRfdG9rZW4AAAAAAAATAAAAAAAAAA5wcmljZV9wZXJfdW5pdAAAAAAACwAAAAAAAAAMdG90YWxfc3VwcGx5AAAACw==",
  "AAAAAAAAAAAAAAAEbWludAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
  "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAA",
  "AAAAAAAAAAAAAAAGaW52ZXN0AAAAAAACAAAAAAAAAAhpbnZlc3RvcgAAABMAAAAAAAAADnBheW1lbnRfYW1vdW50AAAAAAALAAAAAQAAAAs=",
  "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
  "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAABAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAA",
  "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
  "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
  "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAVhc3NldAAAAAAAB9AAAAAJQXNzZXRJbmZvAAAAAAAAAA==",
  "AAAAAAAAAAAAAAANc2V0X3doaXRlbGlzdAAAAAAAAAMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIaW52ZXN0b3IAAAATAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAAA",
]);

/**
 * Cliente de una instancia ya desplegada. El SDK crea los métodos en tiempo de
 * ejecución a partir del spec; la interfaz del mismo nombre les da sus tipos.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RwaLaunchpadClient extends contract.Client {
  constructor(options: contract.ClientOptions) {
    super(RWA_LAUNCHPAD_SPEC, options);
  }
}
