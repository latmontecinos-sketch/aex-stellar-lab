// Fuente única de los datos del RWA Launchpad (tarea de la semana 4) y de su
// ejecución con los scripts del repo. Sin dependencias, como deployment.ts.

export const RWA_REPO = "https://github.com/latmontecinos-sketch/rwa-launchpad-bootcamp";
export const RWA_UPSTREAM = "https://github.com/Oppia-Software-Labs/rwa-launchpad-bootcamp";
export const RWA_SOURCE = `${RWA_REPO}/blob/main/dia-3/src/lib.rs`;
export const RWA_TESTS_SOURCE = `${RWA_REPO}/blob/main/dia-3/src/test.rs`;
export const RWA_SCRIPTS = `${RWA_REPO}/tree/main/dia-3/scripts`;
export const RWA_ENTREGA = `${RWA_REPO}/blob/main/dia-3/ENTREGA.md`;

// Código de dia-3 con la regla, ya subido a testnet: cada launchpad que se
// despliega desde la web es una instancia nueva de este mismo código.
export const RWA_WASM_HASH = "6b8fea5729c604af7673f1727cecbe7d3e4a6329dde363dfaefe9eeeb90ae1bf";

// Cuántas pruebas corre `cargo test` en dia-3 (src/test.rs).
export const RWA_TESTS = 5;

/** La regla: la inversión mínima, en la unidad más chica del token de pago. */
export const MIN_INVESTMENT = 500n;

/** El activo que inicializa `admin-tool.sh`. El token de pago es el XLM nativo (XLM_CONTRACT). */
export const RWA_ASSET = { name: "RWAToken", totalSupply: 1_000_000n, pricePerUnit: 100n } as const;

// Los errores del contrato (`enum Error` en dia-3/src/lib.rs).
export const RWA_ERRORS = {
  1: { name: "NotInitialized", meaning: "el contrato no se inicializó" },
  2: { name: "AlreadyInitialized", meaning: "el contrato ya estaba inicializado" },
  3: { name: "InsufficientBalance", meaning: "no alcanzan los RWA" },
  4: { name: "InvalidAmount", meaning: "el monto no alcanza para 1 RWA" },
  5: { name: "NotWhitelisted", meaning: "el inversionista no está aprobado" },
  6: { name: "Paused", meaning: "el contrato está en pausa" },
  7: { name: "AmountTooLow", meaning: `el mínimo es ${MIN_INVESTMENT}` },
} as const satisfies Record<number, { name: string; meaning: string }>;

export type RwaErrorCode = keyof typeof RWA_ERRORS;

export function rwaError(code: number | null) {
  return code !== null && code in RWA_ERRORS ? RWA_ERRORS[code as RwaErrorCode] : null;
}

// La ejecución con los scripts del repo (`admin-tool.sh` y `user-tool.sh`), el
// 28 de septiembre de 2026. `invest` queda en null hasta que se corre `user-tool.sh`.
export const RWA_RUN = {
  contract: "CACCOKUX3J426XD745IGWDM4BI7KEBK65QQZD2ALE4OGNP6X5OMLEKMR",
  admin: "GDFALAAENVMLT62TJGD7RIT3PIAEIY2X7JCC7DVBUXDCCKTLSC3ZHPKU",
  investor: "GBAI5EARC3PGRVMGD4CV5XTVMA3QKM2QZFWEVVGCPWXKGLM5EGY75TCC",
  deployTx: "8d87e1c3b02f6d686e5f5410741225a378834ffdc244ad132f8a1e9c0010aee6",
  initializeTx: "b2cbee6d380538a15b2fdb004f92f5f1d5a8c0ff2446b62cd9481ef373b179c2",
  whitelistTx: "30d0e927ac8ef669538075b2e7dd1141fe1092137d22a58f471c547957e9c019",
  investTx: null as string | null,
};
