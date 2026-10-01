import type { Metadata } from "next";
import { RwaDemo } from "@/components/rwa/rwa-demo";
import { ScriptsRun } from "@/components/rwa/scripts-run";

// El balance del contrato de la entrega se lee en el servidor y se renueva cada 5 minutos.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "RWA Launchpad · Ejecución",
  description: "El flujo de la tarea con los scripts, y con botones desde el navegador.",
};

export default function RwaLaunchpadExecution() {
  return (
    <>
      <section aria-labelledby="con-los-scripts">
        <h2 id="con-los-scripts" className="text-2xl font-bold tracking-tight">
          Con los scripts
        </h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">
          Lo que corrí en la terminal, desde la carpeta <code className="font-mono">dia-3</code>.{" "}
          <a href="#hazlo" className="text-accent underline underline-offset-4">
            O hazlo con botones ↓
          </a>
        </p>
        <div className="mt-8">
          <ScriptsRun />
        </div>
      </section>

      <section id="hazlo" aria-labelledby="hazlo-titulo" className="scroll-mt-6 pt-20">
        <h2 id="hazlo-titulo" className="text-2xl font-bold tracking-tight">
          Con botones
        </h2>
        <p className="mt-2 mb-6 max-w-3xl leading-relaxed text-muted">
          El mismo flujo, sin instalar nada. La página crea tus cuentas y tu propia copia del contrato, en la red de
          prueba.
        </p>
        <RwaDemo />
      </section>
    </>
  );
}
