// Fuente única de los datos del contrato Aex Pass y de su primera ejecución.
// Sin dependencias: lo importan páginas, contenido de la biblioteca y scripts.
// Si algo de aquí cambia, cambia en todo el sitio.

export const EXPLORER = "https://stellar.expert/explorer/testnet";
export const RPC_URL = "https://soroban-testnet.stellar.org";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const FRIENDBOT_URL = "https://friendbot.stellar.org";

export const explorer = {
  tx: (hash: string) => `${EXPLORER}/tx/${hash}`,
  account: (address: string) => `${EXPLORER}/account/${address}`,
  contract: (id: string) => `${EXPLORER}/contract/${id}`,
  storage: (id: string) => `${EXPLORER}/contract/${id}/storage`,
};

// Código del contrato Aex Prueba Pass Stellar 01, ya subido a testnet. Cada
// evento que se crea desde la web es una instancia nueva de este mismo código.
export const WASM_HASH = "bbc3d152adfe968892e0c7b96625617443c81694bef47d04b569665205967379";
export const WASM_BYTES = 4_281;
// El XLM nativo expuesto como contrato (Stellar Asset Contract).
export const XLM_CONTRACT = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
// Cuánto extiende `buy` el tiempo de vida del pase, la instancia y el código
// (`BUMP_TO` en src/lib.rs del repo aex-pass).
export const TTL_DAYS = 120;

// Cuántas pruebas corre `cargo test` en el repo aex-pass (src/test.rs).
export const CONTRACT_TESTS = 14;

export const REPO = "https://github.com/latmontecinos-sketch/aex-pass";
export const CONTRACT_SOURCE = `${REPO}/blob/main/src/lib.rs`;

// Los errores del contrato (`enum Error` en src/lib.rs).
export const CONTRACT_ERRORS = {
  1: { name: "InvalidPrice", meaning: "el precio tiene que ser mayor a cero", when: "Al desplegar, con un precio de 0 o menos." },
  2: { name: "AlreadyBought", meaning: "esta cuenta ya compró su pase", when: "Una cuenta intenta comprar un segundo pase." },
  3: { name: "NoPass", meaning: "esta cuenta no tiene pase", when: "El anfitrión hace check-in de alguien que no compró." },
  4: { name: "AlreadyUsed", meaning: "este pase ya se usó", when: "Un segundo check-in con el mismo pase." },
} as const satisfies Record<number, { name: string; meaning: string; when: string }>;

export type ContractErrorCode = keyof typeof CONTRACT_ERRORS;

export function contractError(code: number | null) {
  return code !== null && code in CONTRACT_ERRORS ? CONTRACT_ERRORS[code as ContractErrorCode] : null;
}

// La primera instancia, desplegada e invocada desde el Stellar CLI el 22 de
// septiembre de 2026. Comisiones en stroops, leídas de Horizon (`fee_charged`).
export const ORIGINAL = {
  contract: "CCGIRQW6WUR4WT46DTL2EZMQBCY4SNRF622DN2VODMOYGMSFHMDPP6NW",
  name: "Aex Prueba Pass Stellar 01",
  priceStroops: 10_000_000n,
  host: "GAAAGOVI3UD4E3BF4YG5EKEP7B36UG26YN6M2FOSC3LM5W37QFNN6SKK",
  guest: "GA7KF4C26APK72OCBBEX23AM45GYYDYXCXRCAHI47APCLYWUHSEX2DJH",
  deploy: { tx: "de2cf14fa6a1548b1e4640f79287a6dffc919a346cd28f909ff15bbb4cc9ca56", feeStroops: 109_140n, time: "13:48" },
  buy: { tx: "768aab930342ef4dc68fe35d15903768e7ec9eec90812e2c924a29d0070d3645", feeStroops: 176_433_026n, time: "16:40:17" },
  checkIn: { tx: "1cfcb96f7c1c5d91d4510d8a22045d14cc6be39e79078d55d27878e37c09d367", feeStroops: 7_567n, time: "16:40:27" },
} as const;
