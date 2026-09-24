// Prueba de integración contra testnet: cuentas, despliegue, lecturas y un rechazo.
// No compra: la compra mueve XLM entre cuentas y se prueba desde la interfaz.
// Necesita red: `pnpm test:testnet`.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as s from "../src/lib/stellar.ts";
import { ORIGINAL } from "../src/lib/deployment.ts";

test("un evento nuevo se despliega, empieza sin pases y rechaza el check-in de quien no compró", async () => {
  const [host, guest] = await Promise.all([s.createFundedAccount(), s.createFundedAccount()]);

  const balance = await s.getXlmBalance(host.publicKey);
  assert.ok(balance.ok, "debería leer el saldo del anfitrión");
  assert.equal(balance.value, 100_000_000_000n, "Friendbot da 10.000 XLM");

  let submitted = "";
  const deployed = await s.deployEvent(host.secret, "Prueba de integración", 10_000_000n, (hash) => (submitted = hash));
  assert.ok(deployed.outcome.ok, `el despliegue debería confirmarse: ${deployed.outcome.ok ? "" : deployed.outcome.message}`);
  assert.equal(deployed.outcome.hash, submitted, "el hash avisado antes de esperar es el confirmado");
  assert.match(deployed.contractId, /^C[A-Z2-7]{55}$/);
  assert.ok(deployed.ledger !== null && deployed.ledger > 0);
  const resolved = await s.resolveTx(deployed.outcome.hash);
  assert.equal(resolved.status, "success");
  assert.equal(resolved.status === "success" && resolved.returned, deployed.contractId, "un despliegue pendiente se puede recuperar por su hash");

  assert.equal(await s.getPassStatus(deployed.contractId, guest.publicKey), "none");

  const rejected = await s.checkIn(deployed.contractId, host.secret, guest.publicKey);
  assert.equal(rejected.ok, false);
  assert.equal(!rejected.ok && rejected.code, 3, "NoPass");
  assert.equal(!rejected.ok && rejected.hash, undefined, "un rechazo en la simulación no se envía");

  const events = await s.getContractEvents(deployed.contractId, deployed.ledger ?? 0);
  assert.ok(events.ok, "debería leer los eventos");
  assert.deepEqual(events.value.events, []);
});

test("el contrato original muestra el pase del asistente como usado", async () => {
  assert.equal(await s.getPassStatus(ORIGINAL.contract, ORIGINAL.guest), "used");
});

test("los eventos del contrato original se leen recorriendo todas las páginas", async () => {
  // El despliegue fue en el ledger 4815140; la compra y el check-in ~2.000 ledgers
  // después, así que hace falta seguir el cursor más allá de la primera página.
  const res = await s.getContractEvents(ORIGINAL.contract, 4_805_000);
  assert.ok(res.ok, "debería leer los eventos");
  if (res.value.truncated) return; // Pasaron más de 7 días: el RPC ya no los guarda.
  assert.deepEqual(
    res.value.events.map((e) => [e.name, e.buyer, e.price]),
    [
      ["bought", ORIGINAL.guest, ORIGINAL.priceStroops],
      ["checked_in", ORIGINAL.guest, null],
    ],
  );
});
