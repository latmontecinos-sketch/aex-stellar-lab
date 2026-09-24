import type { Metadata } from "next";
import { AexPass } from "@/components/aex-pass/aex-pass";
import { CLI_STEPS, HowIDidIt } from "@/components/how-i-did-it";

// La lectura en vivo del contrato original se hace en el servidor y se renueva
// cada 5 minutos.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Aex Pass · Ejecución",
  description: `Los ${CLI_STEPS} pasos reales con el Stellar CLI y el mismo flujo para ejecutarlo desde el navegador.`,
};

export default function AexPassExecution() {
  return (
    <>
      <section aria-labelledby="lo-que-ejecute">
        <h2 id="lo-que-ejecute" className="text-2xl font-bold tracking-tight">
          Lo que ejecuté con el Stellar CLI
        </h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">
          Los {CLI_STEPS} pasos reales, del primer comando al estado final: qué escribí en la terminal, qué hace y qué
          quedó registrado en la blockchain.
        </p>
        <div className="mt-8">
          <HowIDidIt />
        </div>
      </section>

      <section id="ejecutalo" aria-labelledby="ejecutalo-titulo" className="scroll-mt-6 pt-20">
        <h2 id="ejecutalo-titulo" className="text-2xl font-bold tracking-tight">
          Ejecútalo tú
        </h2>
        <p className="mt-2 mb-6 max-w-3xl leading-relaxed text-muted">
          El mismo flujo, con botones y sin instalar nada. La página crea tus propias cuentas de prueba y tu
          propio evento (una copia nueva del contrato), así que puedes hacerlo de principio a fin. Todo ocurre en
          la red de prueba: el XLM no tiene valor real.
        </p>
        <AexPass />
      </section>
    </>
  );
}
