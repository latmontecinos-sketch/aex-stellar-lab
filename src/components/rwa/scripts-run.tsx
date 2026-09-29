import type { ReactNode } from "react";
import { MIN_INVESTMENT, RWA_ASSET, RWA_RUN, RWA_SCRIPTS, RWA_TESTS, rwaError } from "@/lib/rwa-deployment";
import { getRwaBalance } from "@/lib/rwa";
import { AddressLink, CodeBlock, ResultBox, SmartLink, TxLink, type Tone } from "@/components/ui";

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
      <span className="font-semibold">En la red ahora:</span>
      <span className="text-muted">
        {balance === null ? "no se pudo leer; prueba en unos minutos." : `el inversionista tiene ${balance} RWA.`}
      </span>
      <span className="text-xs text-muted">(cada 5 minutos)</span>
    </p>
  );
}

export function ScriptsRun() {
  return (
    <>
      <ol className="flex flex-col gap-5">
        <RunStep
          n={1}
          title="Probar"
          command={`cd dia-3\ncargo test`}
          result={
            <p>
              {RWA_TESTS} tests pasan. Con 100 sale {tooLow?.name}; con 500 el inversionista recibe {minted.toString()} RWA.
            </p>
          }
        >
          Los tests corren el contrato en mi computadora, antes de subirlo.
        </RunStep>

        <RunStep
          n={2}
          title="Desplegar en testnet"
          command={`stellar keys generate rwa-admin --network testnet --fund\nstellar keys generate rwa-inversor --network testnet --fund\nstellar contract build\nstellar contract deploy --wasm target/wasm32v1-none/release/rwa_launchpad_dia_3.wasm \\n  --source rwa-admin --network testnet --alias rwa-launchpad`}
          result={
            <p>
              Contrato: <AddressLink address={RWA_RUN.contract} kind="contract" /> · <TxLink hash={RWA_RUN.deployTx} />
            </p>
          }
        >
          Crea las cuentas del admin y del inversionista, y sube el contrato.
        </RunStep>

        <RunStep
          n={3}
          title="Admin: inicializa y aprueba"
          command={`bash scripts/admin-tool.sh`}
          result={
            <ul className="space-y-1">
              <li>
                Activo {RWA_ASSET.name}: {RWA_ASSET.pricePerUnit.toString()} unidades = 1 RWA, se paga en XLM ·{" "}
                <TxLink hash={RWA_RUN.initializeTx} />
              </li>
              <li>
                Inversionista <AddressLink address={RWA_RUN.investor} /> aprobado · <TxLink hash={RWA_RUN.whitelistTx} />
              </li>
            </ul>
          }
        >
          Crea el activo y pone al inversionista en la whitelist.
        </RunStep>

        <RunStep
          n={4}
          title="Inversionista: 100, 500 y balance"
          command={`bash scripts/user-tool.sh`}
          tone={RWA_RUN.investTx ? "ok" : "info"}
          result={
            RWA_RUN.investTx ? (
              <p>
                100 rechazado ({tooLow?.name}). 500 aceptado: {minted.toString()} RWA ·{" "}
                <TxLink hash={RWA_RUN.investTx}>ver en stellar.expert</TxLink>
              </p>
            ) : (
              <p>Pendiente: lo corro en el video.</p>
            )
          }
        >
          Invierte 100 (tiene que fallar), después 500, y mira su balance.{" "}
          <SmartLink href={RWA_SCRIPTS} className="text-accent underline-offset-4 hover:underline">
            Ver los scripts
          </SmartLink>
        </RunStep>
      </ol>
      <LiveBalance />
    </>
  );
}
