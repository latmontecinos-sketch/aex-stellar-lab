import type { Metadata } from "next";
import type { ReactNode } from "react";
import { formatXlm } from "@/lib/format";
import { MIN_INVESTMENT, RWA_ASSET, RWA_ERRORS, RWA_SOURCE, RWA_TESTS_SOURCE } from "@/lib/rwa-deployment";
import { CodeBlock, Mono, SmartLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "RWA Launchpad · Cómo funciona",
  description: "Qué es un RWA Launchpad, dónde va la regla de inversión mínima y cómo se prueba.",
};

const price = RWA_ASSET.pricePerUnit;
const minted = MIN_INVESTMENT / price;

const GATE_SNIPPET = `// dia-3/src/lib.rs (resumido)
fn check_variation_gate(env: &Env, investor: &Address, payment_amount: i128) -> Result<(), Error> {
    if payment_amount < ${MIN_INVESTMENT} {
        return Err(Error::AmountTooLow);   // error #7
    }
    Ok(())
}`;

const ROLES = [
  { who: "Admin", script: "admin-tool.sh", does: "Crea el activo y aprueba a los inversionistas." },
  { who: "Inversionista", script: "user-tool.sh", does: "Invierte, ve su balance y transfiere sus RWA." },
];

const TESTS = [
  { name: "test_invest_100_fails_and_500_works", checks: "100 falla y no cobra; 500 da 5 RWA." },
  { name: "test_invest_minimum_is_inclusive", checks: "499 falla, 500 pasa." },
  { name: "test_invest", checks: "Del repo base: invertir funciona." },
  { name: "test_withdraw", checks: "Del repo base: el admin retira lo cobrado." },
  { name: "test_invest_not_whitelisted", checks: "Del repo base: sin aprobación no se invierte." },
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
      <Section id="que-es" title="Qué es">
        <p>
          Un RWA es un token que representa algo real, como una casa o una factura. El launchpad es el contrato que lo
          vende.
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

      <Section id="regla" title="La regla">
        <p>
          Antes de cobrar, el contrato revisa el monto. Si es menor a {MIN_INVESTMENT.toString()}, se detiene con{" "}
          <Mono>AmountTooLow</Mono>.
        </p>
        <CodeBlock>{GATE_SNIPPET}</CodeBlock>
        <p>
          Es lo primero que revisa <Mono>invest</Mono>: si falla, no se cobra nada.{" "}
          <SmartLink href={RWA_SOURCE} className="text-accent underline underline-offset-4">
            Ver el código
          </SmartLink>
        </p>
      </Section>

      <Section id="precio" title="El precio">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            {price.toString()} unidades = 1 RWA. Entonces {MIN_INVESTMENT.toString()} ÷ {price.toString()} ={" "}
            {minted.toString()} RWA.
          </li>
          <li>
            Se paga con XLM de prueba, contado en su unidad más chica: {MIN_INVESTMENT.toString()} unidades ={" "}
            {formatXlm(MIN_INVESTMENT)} XLM.
          </li>
          <li>Ojo: con 550 pagas 550 y recibes 5 RWA. Lo que sobra no se devuelve.</li>
        </ul>
      </Section>

      <Section id="rechazo" title="Cuando falla">
        <p>
          Antes de enviar, la transacción se simula. Con 100 la simulación ya falla, así que nunca llega a la red: no
          cobra, no paga comisión y no aparece en el explorador.
        </p>
      </Section>

      <Section id="errores" title="Los errores">
        <div tabIndex={0} className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <tbody>
              {Object.entries(RWA_ERRORS).map(([code, error]) => (
                <tr key={code} className={`border-t border-border first:border-t-0 ${error.name === "AmountTooLow" ? "bg-accent-soft" : ""}`}>
                  <td className="px-4 py-2 font-mono">#{code}</td>
                  <td className="px-4 py-2 font-mono text-text">{error.name}</td>
                  <td className="px-4 py-2">
                    {error.meaning}
                    {error.name === "AmountTooLow" && <strong className="text-text"> · nuevo</strong>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="tests" title="Los tests">
        <p>
          <Mono>cargo test</Mono> prueba el contrato en mi computadora.{" "}
          <SmartLink href={RWA_TESTS_SOURCE} className="text-accent underline underline-offset-4">
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
