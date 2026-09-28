import type { ReactNode } from "react";
import { XLM_CONTRACT } from "@/lib/deployment";
import { MIN_INVESTMENT, RWA_ASSET, RWA_RUN, RWA_SCRIPTS, RWA_TESTS, RWA_WASM_HASH, rwaError } from "@/lib/rwa-deployment";
import { getRwaBalance } from "@/lib/rwa";
import { AddressLink, CodeBlock, Mono, ResultBox, SmartLink, TxLink, type Tone } from "@/components/ui";

// La ejecución con los scripts del repo, desde la carpeta dia-3. Los datos
// salen de `lib/rwa-deployment.ts`.
const tooLow = rwaError(7);
const minted = MIN_INVESTMENT / RWA_ASSET.pricePerUnit;

function RunStep({
  n,
  title,
  children,
  command,
  result,
  tone = "ok",
}: {
  n: number;
  title: string;
  children: ReactNode;
  command: string;
  result: ReactNode;
  tone?: Tone;
}) {
  return (
    <li className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
        >
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">
            <span className="sr-only">Paso {n}: </span>
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-muted">{children}</p>
          <div className="mt-4">
            <CodeBlock>{command}</CodeBlock>
          </div>
          <div className="mt-4">
            <ResultBox tone={tone}>{result}</ResultBox>
          </div>
        </div>
      </div>
    </li>
  );
}

/** El balance de RWA del inversionista en el contrato de la entrega, leído en el servidor. */
async function LiveBalance() {
  let balance: bigint | null = null;
  try {
    balance = await getRwaBalance(RWA_RUN.contract, RWA_RUN.investor);
  } catch (error) {
    console.error("No se pudo leer el balance del contrato de la entrega", error);
  }
  return (
    <p className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-4 text-sm">
      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${balance === null ? "bg-bad" : balance > 0n ? "bg-ok" : "bg-muted"}`} />
      <span className="font-semibold">Leído de la red:</span>
      <span className="text-muted">
        {balance === null
          ? "no se pudo leer en la última actualización; vuelve a intentarlo en unos minutos."
          : `el inversionista tiene ${balance} RWA en el contrato de la entrega.`}
      </span>
      <span className="text-xs text-muted">(se actualiza cada 5 minutos)</span>
    </p>
  );
}

export function ScriptsRun() {
  return (
    <>
      <ol className="flex flex-col gap-5">
        <RunStep
          n={1}
          title="Probar la regla"
          command={`cd dia-3\ncargo test`}
          result={
            <>
              <p className="font-medium">{RWA_TESTS} pruebas en verde.</p>
              <p className="mt-1">
                <Mono>test_invest_100_fails_and_500_works</Mono>: {tooLow ? tooLow.name : "el error"} con 100 sin mover
                tokens, y con 500 el inversionista recibe {minted.toString()} RWA.
              </p>
            </>
          }
        >
          Antes de desplegar, las pruebas de <Mono>src/test.rs</Mono> corren el contrato en un entorno local.
        </RunStep>

        <RunStep
          n={2}
          title="Compilar y desplegar en testnet"
          command={`stellar keys generate rwa-admin --network testnet --fund\nstellar keys generate rwa-inversor --network testnet --fund\nstellar contract build\nstellar contract deploy --wasm target/wasm32v1-none/release/rwa_launchpad_dia_3.wasm \\\n  --source rwa-admin --network testnet --alias rwa-launchpad`}
          result={
            <>
              <p className="font-medium">
                Contrato desplegado: <AddressLink address={RWA_RUN.contract} kind="contract" />.
              </p>
              <p className="mt-1">
                Código <Mono>{RWA_WASM_HASH.slice(0, 12)}…</Mono> · <TxLink hash={RWA_RUN.deployTx} />
              </p>
            </>
          }
        >
          Dos cuentas de prueba fondeadas con Friendbot, el admin y el inversionista, y el contrato de dia-3 subido a la
          red.
        </RunStep>

        <RunStep
          n={3}
          title="El admin inicializa y aprueba al inversionista"
          command={`bash scripts/admin-tool.sh`}
          result={
            <ul className="space-y-1">
              <li>
                <Mono>initialize</Mono>: activo {RWA_ASSET.name}, {RWA_ASSET.pricePerUnit.toString()} unidades por RWA,
                token de pago <AddressLink address={XLM_CONTRACT} kind="contract" /> (XLM) ·{" "}
                <TxLink hash={RWA_RUN.initializeTx} />
              </li>
              <li>
                <Mono>set_whitelist</Mono>: <AddressLink address={RWA_RUN.investor} /> aprobado ·{" "}
                <TxLink hash={RWA_RUN.whitelistTx} />
              </li>
            </ul>
          }
        >
          Sin argumentos, <Mono>admin-tool.sh</Mono> corre <Mono>initialize</Mono> y <Mono>set_whitelist</Mono>,
          firmados por <AddressLink address={RWA_RUN.admin} />.
        </RunStep>

        <RunStep
          n={4}
          title="El inversionista invierte 100, luego 500, y consulta su balance"
          command={`bash scripts/user-tool.sh`}
          tone={RWA_RUN.investTx ? "ok" : "info"}
          result={
            RWA_RUN.investTx ? (
              <>
                <p className="font-medium">
                  100 rechazado con {tooLow?.name} (#7); 500 aceptado: {minted.toString()} RWA.
                </p>
                <p className="mt-1">
                  <TxLink hash={RWA_RUN.investTx}>Ver la inversión exitosa en stellar.expert</TxLink>
                </p>
              </>
            ) : (
              <p>
                Esta parte la ejecuto en el video de la entrega. Antes de enviarla simulé las dos inversiones: 100 falla
                con {tooLow?.name} (#7) y 500 devuelve {minted.toString()} RWA.
              </p>
            )
          }
        >
          Sin argumentos, <Mono>user-tool.sh</Mono> intenta invertir 100 (tiene que fallar), invierte 500 y consulta el
          balance. Los dos scripts están en <SmartLink href={RWA_SCRIPTS} className="text-accent underline-offset-4 hover:underline">dia-3/scripts</SmartLink>.
        </RunStep>
      </ol>
      <LiveBalance />
    </>
  );
}
