// Cliente tipado del contrato Aex Pass.
// Generado con `stellar contract bindings typescript --wasm aex_prueba_pass_stellar_01.wasm`
// (Stellar CLI 28) y recortado: sin re-exports del SDK ni polyfill de Buffer.
// El spec va embebido, así que no hace falta descargar el WASM para leerlo.
// Si el contrato cambia, hay que regenerar este archivo.
import { contract } from "@stellar/stellar-sdk";

type AssembledTransaction<T> = contract.AssembledTransaction<T>;
type MethodOptions = contract.MethodOptions;

export type PassStatusValue = { tag: "Bought"; values: void } | { tag: "Used"; values: void };

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface AexPassClient {
  buy: (args: { buyer: string }, options?: MethodOptions) => Promise<AssembledTransaction<contract.Result<void>>>;
  check_in: (args: { buyer: string }, options?: MethodOptions) => Promise<AssembledTransaction<contract.Result<void>>>;
  pass_of: (args: { buyer: string }, options?: MethodOptions) => Promise<AssembledTransaction<contract.Option<PassStatusValue>>>;
  host: (options?: MethodOptions) => Promise<AssembledTransaction<string>>;
  name: (options?: MethodOptions) => Promise<AssembledTransaction<string>>;
  price: (options?: MethodOptions) => Promise<AssembledTransaction<contract.i128>>;
}

export const AEX_PASS_SPEC = new contract.Spec([
  "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAMSW52YWxpZFByaWNlAAAAAQAAAAAAAAANQWxyZWFkeUJvdWdodAAAAAAAAAIAAAAAAAAABk5vUGFzcwAAAAAAAwAAAAAAAAALQWxyZWFkeVVzZWQAAAAABA==",
  "AAAABQAAAAAAAAAAAAAABkJvdWdodAAAAAAAAQAAAAZib3VnaHQAAAAAAAIAAAAAAAAABWJ1eWVyAAAAAAAAEwAAAAEAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAC",
  "AAAABQAAAAAAAAAAAAAACUNoZWNrZWRJbgAAAAAAAAEAAAAKY2hlY2tlZF9pbgAAAAAAAQAAAAAAAAAFYnV5ZXIAAAAAAAATAAAAAQAAAAI=",
  "AAAAAgAAAAAAAAAAAAAAClBhc3NTdGF0dXMAAAAAAAIAAAAAAAAAAAAAAAZCb3VnaHQAAAAAAAAAAAAAAAAABFVzZWQ=",
  "AAAAAAAAAGZFbCBjb21wcmFkb3IgcGFnYSBlbCBwcmVjaW8gYWwgYW5maXRyacOzbiB5IHF1ZWRhIGNvbiBzdSBwYXNlLgpVbmEgYWRkcmVzcyBzb2xvIHB1ZWRlIGNvbXByYXIgdW4gcGFzZS4AAAAAAANidXkAAAAAAQAAAAAAAAAFYnV5ZXIAAAAAAAATAAAAAQAAA+kAAAACAAAAAw==",
  "AAAAAAAAAAAAAAAEaG9zdAAAAAAAAAABAAAAEw==",
  "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
  "AAAAAAAAAAAAAAAFcHJpY2UAAAAAAAAAAAAAAQAAAAs=",
  "AAAAAAAAADpFc3RhZG8gZGVsIHBhc2UgZGUgdW5hIGFkZHJlc3M6IGBOb25lYCwgYEJvdWdodGAgbyBgVXNlZGAuAAAAAAAHcGFzc19vZgAAAAABAAAAAAAAAAVidXllcgAAAAAAABMAAAABAAAD6AAAB9AAAAAKUGFzc1N0YXR1cwAA",
  "AAAAAAAAAHJFbCBhbmZpdHJpw7NuIG1hcmNhIGxhIGVudHJhZGEgYWwgYWRtaXRpciBhIGxhIHBlcnNvbmEgZW4gZWwgTWVldC4KVW4gcGFzZSBzb2xvIHBhc2EgZGUgYEJvdWdodGAgYSBgVXNlZGAgdW5hIHZlei4AAAAAAAhjaGVja19pbgAAAAEAAAAAAAAABWJ1eWVyAAAAAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
  "AAAAAAAAAIBDb3JyZSB1bmEgc29sYSB2ZXosIGFsIGRlc3BsZWdhcjogZmlqYSBhbmZpdHJpw7NuLCBhY3Rpdm8gZGUgcGFnbywKcHJlY2lvIChlbiBsYSB1bmlkYWQgbcOtbmltYSBkZWwgYWN0aXZvKSB5IG5vbWJyZSBkZWwgZXZlbnRvLgAAAA1fX2NvbnN0cnVjdG9yAAAAAAAABAAAAAAAAAAEaG9zdAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAFcHJpY2UAAAAAAAALAAAAAAAAAARuYW1lAAAAEAAAAAEAAAPpAAAAAgAAAAM=",
]);

/**
 * Cliente de una instancia ya desplegada. El SDK crea los métodos en tiempo de
 * ejecución a partir del spec; la interfaz del mismo nombre les da sus tipos
 * (el mismo patrón que genera `stellar contract bindings`).
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class AexPassClient extends contract.Client {
  constructor(options: contract.ClientOptions) {
    super(AEX_PASS_SPEC, options);
  }
}

export type DeployArgs = { host: string; token: string; price: contract.i128; name: string };
