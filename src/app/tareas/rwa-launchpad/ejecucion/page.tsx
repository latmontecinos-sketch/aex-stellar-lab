import type { Metadata } from "next";
import { RwaDemo } from "@/components/rwa/rwa-demo";
import { ScriptsRun } from "@/components/rwa/scripts-run";

// El balance del contrato de la entrega se lee en el servidor y se renueva cada 5 minutos.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "RWA Launchpad · Ejecución",
  description: "El flujo de la tarea con los scripts del repo en testnet, y el mismo flujo para ejecutarlo desde el navegador.",
};

export default function RwaLaunchpadExecution() {
  return (
    <>
      <section aria-labelledby="con-los-scripts">
        <h2 id="con-los-scripts" className="text-2xl font-bold tracking-tight">
          Lo que ejecuté con los scripts
        </h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">
          El flujo de la tarea en el contrato de la entrega, con <code className="font-mono">admin-tool.sh</code> y{" "}
          <code className="font-mono">user-tool.sh</code> desde la carpeta <code className="font-mono">dia-3</code>.{" "}
          <a href="#hazlo" className="text-accent underline-offset-4 hover:underline">
            O hazlo tú desde el navegador ↓
          </a>
        </p>
        <div className="mt-8">
          <ScriptsRun />
        </div>
      </section>

      <section id="hazlo" aria-labelledby="hazlo-titulo" className="scroll-mt-6 pt-20">
        <h2 id="hazlo-titulo" className="text-2xl font-bold tracking-tight">
          Hazlo tú
        </h2>
        <p className="mt-2 mb-6 max-w-3xl leading-relaxed text-muted">
          El mismo flujo, con botones y sin instalar nada. La página crea tus propias cuentas de prueba y tu propio
          launchpad (una copia nueva del mismo contrato), así que puedes hacerlo de principio a fin. Todo ocurre en la
          red de prueba: el XLM no tiene valor real.
        </p>
        <RwaDemo />
      </section>
    </>
  );
}
