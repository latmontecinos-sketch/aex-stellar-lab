// La guía para construir en Stellar, semana a semana. Cada paso apunta a
// entradas de la biblioteca por su id: así un recurso se describe una sola vez.
import { library } from "./library";
import type { Entry } from "./schema";

export type GuideStep = {
  week: number;
  title: string;
  /** Qué vas a lograr esta semana, en una frase. */
  goal: string;
  /** Qué hacer, en orden. */
  steps: string[];
  /** Ids de la biblioteca. */
  resources: string[];
  /** Tarea del programa para practicar, por su slug. */
  task?: string;
};

export const guide: GuideStep[] = [
  {
    week: 1,
    title: "Encontrar la idea",
    goal: "Entender cómo funciona el programa y elegir qué construir en Stellar.",
    steps: [
      "Mira las sesiones de introducción.",
      "Instala las skills de Stellar Build y úsalas para buscar y validar una idea.",
      "Si un concepto cuesta, repásalo en afterStellar.",
    ],
    resources: ["semana-1-introduccion", "semana-1-sesion-3", "stellar-build", "after-stellar", "stellar-bolivia-ig"],
  },
  {
    week: 2,
    title: "Pensar el producto",
    goal: "Saber para quién es, qué problema resuelve y cuál es el MVP más chico que sirve.",
    steps: [
      "Habla con posibles usuarios antes de escribir código.",
      "Define el problema, el valor y el alcance del MVP.",
      "Piensa cómo vas a llegar a tus usuarios y cómo medir si funciona.",
    ],
    resources: ["semana-2-sesion-1", "semana-2-sesion-2", "semana-2-sesion-3"],
  },
  {
    week: 3,
    title: "Escribir el contrato",
    goal: "Escribir, probar y desplegar en testnet tu primer contrato Soroban.",
    steps: [
      "Instala Rust, el target wasm32v1-none y el Stellar CLI.",
      "Aprende la estructura de un contrato: storage, require_auth, errores y eventos.",
      "Usa tokens con el SAC y, si te sirven, los contratos de OpenZeppelin.",
      "Despliega en testnet y revisa cada transacción en stellar.expert.",
    ],
    resources: [
      "clase-1",
      "clase-2",
      "clase-3",
      "curso-fabian",
      "docs-contratos",
      "soroban-examples",
      "docs-sac",
      "docs-openzeppelin",
      "anatomia-contrato",
      "require-auth",
      "comandos-cli",
      "stellar-cli",
      "rust-wasm",
      "stellar-expert",
    ],
    task: "aex-pass",
  },
  {
    week: 4,
    title: "Conectar con la web",
    goal: "Que una página llame a tu contrato con la wallet del usuario y muestre bien los errores.",
    steps: [
      "Genera los bindings de TypeScript de tu contrato.",
      "Llama al contrato con stellar-sdk y firma con Freighter.",
      "Si hace falta, arma un backend que prepare las transacciones.",
      "Simula antes de enviar y traduce los errores para el usuario.",
    ],
    resources: [
      "semana-4-sesion-2",
      "semana-4-clase-25",
      "docs-bindings",
      "stellar-sdk-js",
      "simular",
      "docs-seps",
      "stellar-lab",
      "rwa-launchpad",
    ],
    task: "rwa-launchpad",
  },
  {
    week: 5,
    title: "Construir con IA",
    goal: "Usar agentes de IA con el contexto correcto de Stellar para avanzar más rápido sin perder calidad.",
    steps: [
      "Planifica antes de pedir código: objetivo, alcance y arquitectura.",
      "Conecta tu agente a Stellar con un MCP (Raven) y las skills oficiales.",
      "Suma piezas del ecosistema: precios con Reflector y escrow con Trustless Work.",
      "Revisa lo que hace el agente y vigila los tokens.",
    ],
    resources: [
      "semana-5-sesion-1",
      "clase-vibe-coding",
      "raven",
      "skills-stellar",
      "openzeppelin-mcp",
      "stellar-expert-mcp",
      "reflector-skill",
      "trustless-blocks",
      "v0",
    ],
  },
];

/** Las entradas de un paso. Si un id no existe, el build falla. */
export function resourcesOf(step: GuideStep): Entry[] {
  return step.resources.map((id) => {
    const entry = library.find((e) => e.id === id);
    if (!entry) throw new Error(`La guía (semana ${step.week}) apunta a "${id}", que no está en la biblioteca.`);
    return entry;
  });
}
