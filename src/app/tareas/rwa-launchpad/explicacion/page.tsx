import type { Metadata } from "next";
import type { ReactNode } from "react";
import { formatXlm } from "@/lib/format";
import { MIN_INVESTMENT, RWA_ASSET, RWA_ERRORS, RWA_SOURCE, RWA_TESTS, RWA_TESTS_SOURCE } from "@/lib/rwa-deployment";
import { CodeBlock, Mono, SmartLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "RWA Launchpad · Cómo funciona",
  description: "Qué es un RWA Launchpad, dónde va la regla de inversión mínima y cómo la prueban los tests.",
};

const price = RWA_ASSET.pricePerUnit;
const minted = MIN_INVESTMENT / price;

const GATE_SNIPPET = `// Resumido de dia-3/src/lib.rs
pub const MIN_INVESTMENT: i128 = ${MIN_INVESTMENT};

fn check_variation_gate(env: &Env, investor: &Address, payment_amount: i128) -> Result<(), Error> {
    if payment_amount < MIN_INVESTMENT {
        return Err(Error::AmountTooLow);           // error #7, nuevo
    }
    Ok(())
}

pub fn invest(env: Env, investor: Address, payment_amount: i128) -> i128 {
    investor.require_auth();                       // firma del inversionista
    check_variation_gate(&env, &investor, payment_amount)?;  // la regla, antes que todo
    require_not_paused(&env);
    if !is_whitelisted(&env, &investor) { panic!(NotWhitelisted) }
    let rwa_amount = payment_amount / asset.price_per_unit;
    token.transfer(&investor, &contrato, &payment_amount);   // cobra
    internal_mint(&env, &investor, rwa_amount);              // entrega los RWA
    rwa_amount
}`;

const ROLES = [
  {
    who: "Admin",
    script: "admin-tool.sh",
    does: "Define el activo (initialize), aprueba inversionistas (set_whitelist), emite RWA (mint), retira lo recaudado (withdraw) y pausa las ventas (pause).",
  },
  {
    who: "Inversionista",
    script: "user-tool.sh",
    does: "Invierte pagando con el token de pago (invest), consulta sus RWA (balance) y los transfiere a otra cuenta (transfer).",
  },
];

const TESTS: { name: string; checks: string }[] = [
  { name: "test_invest_100_fails_and_500_works", checks: "100 falla con AmountTooLow sin tocar saldos; 500 entrega 5 RWA y el contrato recibe 500." },
  { name: "test_invest_minimum_is_inclusive", checks: "499 falla y 500 pasa: el mínimo está incluido." },
  { name: "test_invest", checks: "Del repo base: una inversión de 500 entrega 5 RWA." },
  { name: "test_withdraw", checks: "Del repo base: el admin retira lo recaudado a la tesorería." },
  { name: "test_invest_not_whitelisted", checks: "Del repo base: quien no está en la whitelist no puede invertir (#5)." },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="max-w-3xl">
      <h2 id={id} className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function RwaLaunchpadExplanation() {
  return (
    <div className="flex flex-col gap-14">
      <Section id="que-es" title="Qué es un RWA Launchpad">
        <p>
          Un RWA (<em>real-world asset</em>) es un token que representa un activo del mundo real: un inmueble, una
          factura, oro. El launchpad es el contrato que lo vende: el emisor define el activo y su precio, aprueba a
          quién le vende, y los inversionistas pagan con otro token y reciben RWA a cambio.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.map((role) => (
            <div key={role.who} className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-semibold text-text">
                {role.who} <span className="font-normal text-muted">· {role.script}</span>
              </p>
              <p className="mt-1 text-sm">{role.does}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="regla" title="La regla y dónde va">
        <p>
          El repo del bootcamp deja un lugar preparado para la regla de cada equipo: <Mono>check_variation_gate</Mono>,
          que <Mono>invest</Mono> llama antes de cobrar. Venía sin regla y sin el monto, así que le agregué el parámetro{" "}
          <Mono>payment_amount</Mono> y la comparación con el mínimo.
        </p>
        <CodeBlock>{GATE_SNIPPET}</CodeBlock>
        <p>
          La regla corre antes que todo lo demás: una inversión chica falla con <Mono>AmountTooLow</Mono> aunque el
          launchpad esté en pausa o el inversionista no esté en la whitelist, y nunca llega a cobrar.{" "}
          <SmartLink href={RWA_SOURCE} className="text-accent underline-offset-4 hover:underline">
            Ver el contrato completo
          </SmartLink>
        </p>
      </Section>

      <Section id="cuentas" title={`Por qué ${MIN_INVESTMENT} unidades dan ${minted} RWA`}>
        <p>
          El admin inicializó el activo con un precio de {price.toString()} unidades del token de pago por cada RWA. El
          contrato divide: {MIN_INVESTMENT.toString()} ÷ {price.toString()} = {minted.toString()} RWA.
        </p>
        <p>
          El token de pago es el XLM de la red de prueba, y los contratos lo cuentan en su unidad más chica, el stroop
          (0,0000001 XLM). Por eso {MIN_INVESTMENT.toString()} unidades son {formatXlm(MIN_INVESTMENT)} XLM: la regla
          se prueba con montos mínimos.
        </p>
        <p>
          Algo que noté al leer el código: la división descarta el resto, pero el contrato cobra el monto completo. Una
          inversión de 550 paga 550 y recibe 5 RWA; los 50 que sobran quedan en el contrato.
        </p>
      </Section>

      <Section id="rechazo" title="Qué pasa cuando se rechaza">
        <p>
          Antes de enviar una transacción, el CLI y la página la <strong className="text-text">simulan</strong>. Con
          100, la simulación ya falla con <Mono>Error(Contract, #7)</Mono>, así que la transacción nunca llega a la red:
          no se cobra nada, no hay comisión y el inversionista sigue con 0 RWA. Por eso la inversión fallida no tiene
          link en el explorador y la exitosa sí.
        </p>
        <p>
          Y si una transacción enviada falla a mitad de camino, Soroban deshace todo: el cobro y la entrega de RWA pasan
          juntos o no pasan.
        </p>
      </Section>

      <Section id="errores" title="Los errores del contrato">
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-text">
              <tr>
                <th className="px-4 py-2 font-semibold">#</th>
                <th className="px-4 py-2 font-semibold">Nombre</th>
                <th className="px-4 py-2 font-semibold">Qué significa</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(RWA_ERRORS).map(([code, error]) => (
                <tr key={code} className={`border-t border-border ${error.name === "AmountTooLow" ? "bg-accent-soft" : ""}`}>
                  <td className="px-4 py-2 font-mono">{code}</td>
                  <td className="px-4 py-2 font-mono text-text">{error.name}</td>
                  <td className="px-4 py-2">
                    {error.meaning}
                    {error.name === "AmountTooLow" && <strong className="text-text"> (nuevo)</strong>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="tests" title={`Los ${RWA_TESTS} tests`}>
        <p>
          <Mono>cargo test</Mono> en <Mono>dia-3</Mono> corre el contrato en un entorno local, con un token de pago de
          prueba.{" "}
          <SmartLink href={RWA_TESTS_SOURCE} className="text-accent underline-offset-4 hover:underline">
            Ver los tests
          </SmartLink>
        </p>
        <ul className="space-y-2">
          {TESTS.map((t) => (
            <li key={t.name} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <Mono>{t.name}</Mono>
              <p className="mt-0.5">{t.checks}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
