// Todo el contenido del sitio vive aquí: la biblioteca y las tareas.
// Para agregar algo, se suma una entrada a `library` o a `tasks`.

export type Kind = "repositorio" | "apunte" | "recurso" | "herramienta";

export type Link = { label: string; href: string };

export type Entry = {
  id: string;
  title: string;
  kind: Kind;
  summary: string;
  tags: string[];
  links: Link[];
  /** Fecha en que se agregó, AAAA-MM-DD. */
  date: string;
  /** Tarea relacionada, por su slug. */
  task?: string;
};

export type TaskStatus = "pendiente" | "en-progreso" | "entregado";

export type Task = {
  slug: string;
  title: string;
  track: string;
  due: string;
  status: TaskStatus;
  statusNote?: string;
  summary: string;
};

export const site = {
  name: "Aex Stellar Lab",
  tagline: "Una biblioteca personal de lo que voy aprendiendo",
  program: "Stellar Elite Bolivia · 2026",
  author: "Alejandro Tintaya Montecinos",
  authorUrl: "https://latmontecinos.vercel.app",
  repo: "https://github.com/latmontecinos-sketch/aex-stellar-lab",
};

export const KIND_LABELS: Record<Kind, { one: string; many: string }> = {
  repositorio: { one: "Repositorio", many: "Repositorios" },
  apunte: { one: "Apunte", many: "Apuntes" },
  recurso: { one: "Recurso", many: "Recursos" },
  herramienta: { one: "Herramienta", many: "Herramientas" },
};

export const KIND_ORDER: Kind[] = ["repositorio", "apunte", "recurso", "herramienta"];

const EXPLICACION = "/tareas/aex-pass/explicacion";

export const library: Entry[] = [
  // Repositorios
  {
    id: "aex-pass",
    title: "Aex Pass",
    kind: "repositorio",
    summary:
      "El contrato Event Pass en Rust con soroban-sdk: pase para un Meet que se compra una vez y se usa una vez. Incluye sus 7 pruebas y la demo del Stellar CLI con cada resultado explicado.",
    tags: ["Soroban", "Rust", "Testnet"],
    links: [
      { label: "GitHub", href: "https://github.com/latmontecinos-sketch/aex-pass" },
      {
        label: "Contrato",
        href: "https://stellar.expert/explorer/testnet/contract/CCGIRQW6WUR4WT46DTL2EZMQBCY4SNRF622DN2VODMOYGMSFHMDPP6NW",
      },
    ],
    date: "2026-09-22",
    task: "aex-pass",
  },
  {
    id: "aex-stellar-lab",
    title: "Aex Stellar Lab",
    kind: "repositorio",
    summary:
      "Este sitio: Next.js 16 y @stellar/stellar-sdk. Aquí viven la biblioteca y la ejecución interactiva de cada tarea, directo contra testnet desde el navegador.",
    tags: ["Next.js", "stellar-sdk"],
    links: [{ label: "GitHub", href: "https://github.com/latmontecinos-sketch/aex-stellar-lab" }],
    date: "2026-09-22",
  },
  {
    id: "kosmovia",
    title: "Kosmovia",
    kind: "repositorio",
    summary:
      "Red social para el ecosistema Stellar que construyo con mi equipo de Stellar Elite Bolivia: comunidades, un muro y una billetera integrada. En desarrollo, sobre testnet.",
    tags: ["Equipo", "En desarrollo"],
    links: [
      { label: "GitHub", href: "https://github.com/kosmovia/kosmovia" },
      { label: "Sitio", href: "https://kosmovia.vercel.app" },
    ],
    date: "2026-09-16",
  },
  {
    id: "stellar-build",
    title: "Stellar Build",
    kind: "repositorio",
    summary:
      "Repositorio base del programa, creado desde el template oficial stellar-build-toolkit: 34 skills de Claude Code para construir en Stellar (contratos, dapps, assets, datos y estándares). Fue mi primer entregable.",
    tags: ["Toolkit", "Claude Code"],
    links: [{ label: "GitHub", href: "https://github.com/latmontecinos-sketch/Stellar-Build" }],
    date: "2026-09-06",
  },

  // Apuntes
  {
    id: "anatomia-contrato",
    title: "Anatomía de un contrato Soroban",
    kind: "apunte",
    summary:
      "Un contrato es un struct con #[contract] y sus funciones en #[contractimpl]. __constructor corre una sola vez, al desplegar. Los datos van en storage (instance para la configuración, persistent para lo de cada usuario), los errores se tipan con #[contracterror] y los avisos públicos se publican con #[contractevent].",
    tags: ["Soroban", "Rust"],
    links: [{ label: "Ver en Aex Pass", href: `${EXPLICACION}#funciones` }],
    date: "2026-09-22",
    task: "aex-pass",
  },
  {
    id: "require-auth",
    title: "Autorización con require_auth",
    kind: "apunte",
    summary:
      "require_auth exige que esa cuenta haya firmado esta llamada exacta. La firma del comprador cubre buy y también la transferencia que el contrato hace adentro. Para roles como el anfitrión, la dirección se lee del storage y no de un parámetro: así nadie se hace pasar por él.",
    tags: ["Soroban", "Seguridad"],
    links: [{ label: "Ver en Aex Pass", href: `${EXPLICACION}#reglas` }],
    date: "2026-09-22",
    task: "aex-pass",
  },
  {
    id: "renta-ttl",
    title: "Renta y TTL del storage",
    kind: "apunte",
    summary:
      "Cada dato guardado tiene un tiempo de vida (TTL) y mantenerlo cuesta renta. Mi primera compra cobró 17,64 XLM porque extendía el pase, el contrato y su código a 120 días. Lección: ajustar el plazo a la duración real del evento.",
    tags: ["Soroban", "Costos"],
    links: [{ label: "Ver en Aex Pass", href: `${EXPLICACION}#costos` }],
    date: "2026-09-22",
    task: "aex-pass",
  },
  {
    id: "simular",
    title: "Simular antes de enviar",
    kind: "apunte",
    summary:
      "El CLI y el SDK simulan cada transacción antes de enviarla. Si la simulación falla, por ejemplo con Error(Contract, #4), no se envía nada ni se cobra. Las lecturas como pass_of solo se simulan: no cuestan.",
    tags: ["Stellar CLI", "stellar-sdk"],
    links: [{ label: "Ver en Aex Pass", href: `${EXPLICACION}#errores` }],
    date: "2026-09-22",
    task: "aex-pass",
  },
  {
    id: "leer-transaccion",
    title: "Leer una transacción en stellar.expert",
    kind: "apunte",
    summary:
      "En la página de una transacción, la flecha ⇊ despliega el detalle: qué contrato se invocó, las transferencias, los eventos, los datos creados o actualizados en el storage, los recursos usados y la comisión.",
    tags: ["Explorador"],
    links: [{ label: "Ejemplo: la compra de Aex Pass", href: "https://stellar.expert/explorer/testnet/tx/768aab930342ef4dc68fe35d15903768e7ec9eec90812e2c924a29d0070d3645" }],
    date: "2026-09-22",
    task: "aex-pass",
  },
  {
    id: "comandos-cli",
    title: "Comandos esenciales del Stellar CLI",
    kind: "apunte",
    summary:
      "keys generate --fund crea y fondea una cuenta de prueba. contract build compila a WASM. contract deploy publica el contrato (los argumentos del constructor van después de --). contract invoke llama a una función; con --send=no solo simula.",
    tags: ["Stellar CLI"],
    links: [{ label: "Ver la ejecución completa", href: "/tareas/aex-pass/ejecucion" }],
    date: "2026-09-22",
    task: "aex-pass",
  },

  // Recursos
  {
    id: "docs-contratos",
    title: "Documentación de contratos",
    kind: "recurso",
    summary: "La guía oficial para escribir, probar y desplegar contratos en Stellar.",
    tags: ["Oficial"],
    links: [{ label: "developers.stellar.org", href: "https://developers.stellar.org/docs/build/smart-contracts" }],
    date: "2026-09-22",
  },
  {
    id: "soroban-examples",
    title: "soroban-examples",
    kind: "recurso",
    summary: "Contratos de ejemplo oficiales: tokens, autorización, eventos, storage y más.",
    tags: ["Oficial", "Código"],
    links: [{ label: "GitHub", href: "https://github.com/stellar/soroban-examples" }],
    date: "2026-09-22",
  },
  {
    id: "soroban-sdk-docs",
    title: "Referencia de soroban-sdk",
    kind: "recurso",
    summary: "La documentación de la librería de Rust para contratos: tipos, storage, auth, tokens y eventos.",
    tags: ["Rust"],
    links: [{ label: "docs.rs", href: "https://docs.rs/soroban-sdk" }],
    date: "2026-09-22",
  },
  {
    id: "stellar-lab",
    title: "Stellar Lab",
    kind: "recurso",
    summary: "Herramienta web oficial para crear cuentas, armar transacciones e invocar contratos sin terminal.",
    tags: ["Oficial"],
    links: [{ label: "lab.stellar.org", href: "https://lab.stellar.org" }],
    date: "2026-09-22",
  },
  {
    id: "stellar-expert",
    title: "stellar.expert (testnet)",
    kind: "recurso",
    summary: "Explorador de la blockchain: cuentas, transacciones, contratos, eventos y storage.",
    tags: ["Explorador"],
    links: [{ label: "stellar.expert", href: "https://stellar.expert/explorer/testnet" }],
    date: "2026-09-22",
  },

  // Herramientas
  {
    id: "stellar-cli",
    title: "Stellar CLI",
    kind: "herramienta",
    summary: "La herramienta oficial de terminal. Uso la versión 28, instalada con winget.",
    tags: ["Terminal"],
    links: [{ label: "Manual", href: "https://developers.stellar.org/docs/tools/cli/stellar-cli" }],
    date: "2026-09-22",
  },
  {
    id: "rust-wasm",
    title: "Rust + wasm32v1-none",
    kind: "herramienta",
    summary: "El lenguaje de los contratos y el target que los compila al WebAssembly que corre la red.",
    tags: ["Rust"],
    links: [{ label: "rustup", href: "https://rustup.rs" }],
    date: "2026-09-22",
  },
  {
    id: "stellar-sdk-js",
    title: "@stellar/stellar-sdk",
    kind: "herramienta",
    summary: "El SDK de JavaScript. En este sitio despliega e invoca contratos desde el navegador.",
    tags: ["JavaScript"],
    links: [{ label: "npm", href: "https://www.npmjs.com/package/@stellar/stellar-sdk" }],
    date: "2026-09-22",
  },
  {
    id: "friendbot",
    title: "Friendbot",
    kind: "herramienta",
    summary: "El servicio de testnet que regala XLM de prueba para fondear cuentas nuevas.",
    tags: ["Testnet"],
    links: [{ label: "Documentación", href: "https://developers.stellar.org/docs/learn/fundamentals/networks#friendbot" }],
    date: "2026-09-22",
  },
];

export const tasks: Task[] = [
  {
    slug: "aex-pass",
    title: "Invocación de un contrato: Event Pass",
    track: "Event Pass",
    due: "2026-09-17",
    status: "en-progreso",
    statusNote: "Falta el video",
    summary:
      "Un contrato propio con una invocación exitosa desde el Stellar CLI, su evento y estado en el explorador, y qué sigo aprendiendo. Mi solución: Aex Pass, un pase para entrar a un Meet.",
  },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  "en-progreso": "En progreso",
  entregado: "Entregado",
};

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${months[m - 1]} ${y}`;
}
