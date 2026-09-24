import { ORIGINAL } from "@/lib/deployment";
import { getPassStatus, type PassStatus } from "@/lib/stellar";

const LABELS: Record<PassStatus, string> = {
  none: "sin pase",
  bought: "comprado, sin usar",
  used: "usado",
};

/**
 * Lee de la red el pase del asistente en el contrato original. Corre en el
 * servidor (la página se regenera cada pocos minutos), así el navegador no
 * descarga el SDK de Stellar solo para esto.
 */
export async function OriginalLiveStatus() {
  let status: PassStatus | null = null;
  try {
    status = await getPassStatus(ORIGINAL.contract, ORIGINAL.guest);
  } catch (error) {
    console.error("No se pudo leer el pase del contrato original", error);
  }

  return (
    <p className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-4 text-sm">
      <span
        aria-hidden
        className={`h-2.5 w-2.5 rounded-full ${status === "used" ? "bg-ok" : status === null ? "bg-bad" : "bg-muted"}`}
      />
      <span className="font-semibold">Leído de la red:</span>
      <span className="text-muted">
        {status === null
          ? "no se pudo leer en la última actualización; vuelve a intentarlo en unos minutos."
          : `el pase del asistente está ${LABELS[status]}.`}
      </span>
      <span className="text-xs text-muted">(se actualiza cada 5 minutos)</span>
    </p>
  );
}
