// Montos y direcciones. Sin dependencias: lo usan tanto el servidor como el
// navegador, y los tests corren con `node --test`.

export const STROOPS_PER_XLM = 10_000_000n;
const DECIMALS = 7;

// Un monto escrito por una persona: enteros y hasta 7 decimales, con punto o
// coma. Nada de signos, exponentes ni separadores de miles.
const XLM_INPUT = /^(\d{1,12})(?:[.,](\d{1,7}))?$/;

/** Convierte lo que escribió el usuario a stroops, o `null` si no es un monto válido. */
export function parseXlm(input: string): bigint | null {
  const match = XLM_INPUT.exec(input.trim());
  if (!match) return null;
  const [, whole, fraction = ""] = match;
  return BigInt(whole) * STROOPS_PER_XLM + BigInt(fraction.padEnd(DECIMALS, "0"));
}

/** Convierte un saldo de Horizon ("9999.9999800") a stroops, sin pasar por números de coma flotante. */
export function stroopsFromDecimal(value: string): bigint {
  const match = /^(-?)(\d+)(?:\.(\d{1,7}))?$/.exec(value);
  if (!match) throw new Error(`Monto inválido: ${value}`);
  const [, sign, whole, fraction = ""] = match;
  const stroops = BigInt(whole) * STROOPS_PER_XLM + BigInt(fraction.padEnd(DECIMALS, "0"));
  return sign ? -stroops : stroops;
}

/**
 * Formatea stroops como XLM al estilo de Bolivia: coma decimal y punto de miles.
 * Con `maxDecimals` redondea (mitad hacia arriba); si no, muestra el valor exacto.
 */
export function formatXlm(stroops: bigint, maxDecimals: number = DECIMALS): string {
  const negative = stroops < 0n;
  let value = negative ? -stroops : stroops;
  if (maxDecimals < DECIMALS) {
    const step = 10n ** BigInt(DECIMALS - maxDecimals);
    value = ((value + step / 2n) / step) * step;
  }
  const whole = (value / STROOPS_PER_XLM).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fraction = (value % STROOPS_PER_XLM).toString().padStart(DECIMALS, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `,${fraction}` : ""}`;
}

export function short(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
