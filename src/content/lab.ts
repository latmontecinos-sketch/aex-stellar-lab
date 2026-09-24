// Todo el contenido del sitio vive aquí: la biblioteca y las tareas.
// Para agregar algo, se suma una entrada a `library` o a `tasks`.

export type Kind =
  | "clase"
  | "apunte"
  | "documentacion"
  | "repositorio"
  | "skill"
  | "herramienta"
  | "lectura"
  | "comunidad";

export type Link = { label: string; href: string };

export type Entry = {
  id: string;
  title: string;
  kind: Kind;
  summary: string;
  tags: string[];
  links: Link[];
  /** Fecha en que llegó a la biblioteca (o de la clase), AAAA-MM-DD. */
  date: string;
  /** Semana del programa. */
  week: number;
  /** Quién lo hizo o lo publicó, si no soy yo. */
  author?: string;
  /** Para repositorios: si es mío, de la comunidad u oficial. */
  origin?: "mio" | "comunidad" | "oficial";
  /** Id de YouTube, para mostrar la miniatura. */
  video?: string;
  /** Orden dentro de su sección (menor primero). Si falta, va por fecha. */
  order?: number;
  /** Tarea relacionada, por su slug. */
  task?: string;
};

export type TaskStatus = "pendiente" | "en-progreso" | "entregado";

export type Task = {
  slug: string;
  title: string;
  track: string;
  week: number;
  due: string;
  status: TaskStatus;
  statusNote?: string;
  summary: string;
};

export const site = {
  name: "Aex Stellar Lab",
  tagline: "Una biblioteca personal de lo que voy aprendiendo",
  program: "Stellar Elite Bolivia · 2026",
  currentWeek: 4,
  author: "Alejandro Tintaya Montecinos",
  authorUrl: "https://latmontecinos.vercel.app",
  repo: "https://github.com/latmontecinos-sketch/aex-stellar-lab",
};

export const KINDS: Record<Kind, { one: string; many: string; description: string }> = {
  clase: {
    one: "Clase",
    many: "Clases y videos",
    description: "Las grabaciones de las clases del programa y cursos para repasar.",
  },
  apunte: {
    one: "Apunte",
    many: "Mis apuntes",
    description: "Lo que aprendí, en mis palabras.",
  },
  documentacion: {
    one: "Documentación",
    many: "Documentación",
    description: "Guías oficiales y referencias.",
  },
  repositorio: {
    one: "Repositorio",
    many: "Repositorios",
    description: "Lo que construyo y repos de la comunidad para estudiar.",
  },
  skill: {
    one: "Skill",
    many: "Skills e IA",
    description: "Skills de Claude Code y herramientas de IA para construir en Stellar.",
  },
  herramienta: {
    one: "Herramienta",
    many: "Herramientas",
    description: "Lo que uso para escribir, desplegar y revisar contratos.",
  },
  lectura: {
    one: "Lectura",
    many: "Lecturas",
    description: "Newsletters y publicaciones del ecosistema y de compañeros.",
  },
  comunidad: {
    one: "Comunidad",
    many: "Comunidad y oportunidades",
    description: "Dónde está la comunidad y convocatorias abiertas.",
  },
};

export const KIND_ORDER: Kind[] = [
  "clase",
  "apunte",
  "documentacion",
  "repositorio",
  "skill",
  "herramienta",
  "lectura",
  "comunidad",
];

export const ORIGIN_LABELS: Record<NonNullable<Entry["origin"]>, string> = {
  mio: "Mío",
  comunidad: "Comunidad",
  oficial: "Oficial",
};

const EXPLICACION = "/tareas/aex-pass/explicacion";
const SKILLS = "https://github.com/latmontecinos-sketch/Stellar-Build/tree/main/.claude/skills";
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

function skill(name: string, summary: string, order: number): Entry {
  return {
    id: `skill-${name}`,
    title: name,
    kind: "skill",
    summary,
    tags: ["Claude Code", "Stellar Build"],
    links: [{ label: "Ver la skill", href: `${SKILLS}/${name}` }],
    date: "2026-09-06",
    week: 1,
    order,
  };
}

export const library: Entry[] = [
  // ── Clases y videos ────────────────────────────────────────────────
  {
    id: "clase-1",
    title: "Sesión 1: Smart Contracts",
    kind: "clase",
    summary: "Primera clase del bootcamp de contratos inteligentes de Stellar Elite Bolivia.",
    tags: ["Bootcamp", "Soroban"],
    links: [{ label: "YouTube", href: yt("fnrLiRpMHXE") }],
    author: "Emmi",
    video: "fnrLiRpMHXE",
    date: "2026-09-15",
    week: 3,
    order: 1,
  },
  {
    id: "clase-2",
    title: "Clase 2: Smart Contracts",
    kind: "clase",
    summary: "Segunda clase del bootcamp, del 16 de septiembre.",
    tags: ["Bootcamp", "Soroban"],
    links: [{ label: "YouTube", href: yt("jJtw_85WJjA") }],
    author: "Leonardo Vaca",
    video: "jJtw_85WJjA",
    date: "2026-09-16",
    week: 3,
    order: 2,
  },
  {
    id: "clase-3",
    title: "Clase 3: Smart Contracts",
    kind: "clase",
    summary:
      "Tercera clase del bootcamp, del 17 de septiembre: la de los tres tracks del entregable (event pass, votación y sponsor board).",
    tags: ["Bootcamp", "Soroban"],
    links: [{ label: "YouTube", href: yt("kmq_19PtAzc") }],
    author: "Leonardo Vaca",
    video: "kmq_19PtAzc",
    date: "2026-09-17",
    week: 3,
    order: 3,
    task: "aex-pass",
  },
  {
    id: "curso-fabian",
    title: "Las bases del desarrollo en Stellar: el primer smart contract",
    kind: "clase",
    summary: "Curso de Fabián Sánchez, recomendado para repasar desde cero cómo se crea un contrato.",
    tags: ["Curso", "Soroban"],
    links: [{ label: "YouTube", href: yt("uyTsLnzYgFs") }],
    author: "Fabián Sánchez",
    video: "uyTsLnzYgFs",
    date: "2026-09-17",
    week: 3,
    order: 4,
  },

  // ── Mis apuntes ────────────────────────────────────────────────────
  {
    id: "anatomia-contrato",
    title: "Anatomía de un contrato Soroban",
    kind: "apunte",
    summary:
      "Un contrato es un struct con #[contract] y sus funciones en #[contractimpl]. __constructor corre una sola vez, al desplegar. Los datos van en storage (instance para la configuración, persistent para lo de cada usuario), los errores se tipan con #[contracterror] y los avisos públicos se publican con #[contractevent].",
    tags: ["Soroban", "Rust"],
    links: [{ label: "Ver en Aex Pass", href: `${EXPLICACION}#funciones` }],
    date: "2026-09-22",
    week: 4,
    order: 1,
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
    week: 4,
    order: 2,
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
    week: 4,
    order: 3,
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
    week: 4,
    order: 4,
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
    week: 4,
    order: 5,
    task: "aex-pass",
  },
  {
    id: "leer-transaccion",
    title: "Leer una transacción en stellar.expert",
    kind: "apunte",
    summary:
      "En la página de una transacción, la flecha ⇊ despliega el detalle: qué contrato se invocó, las transferencias, los eventos, los datos creados o actualizados en el storage, los recursos usados y la comisión.",
    tags: ["Explorador"],
    links: [
      {
        label: "Ejemplo: la compra de Aex Pass",
        href: "https://stellar.expert/explorer/testnet/tx/768aab930342ef4dc68fe35d15903768e7ec9eec90812e2c924a29d0070d3645",
      },
    ],
    date: "2026-09-22",
    week: 4,
    order: 6,
    task: "aex-pass",
  },

  // ── Documentación ──────────────────────────────────────────────────
  {
    id: "docs-contratos",
    title: "Contratos inteligentes en Stellar",
    kind: "documentacion",
    summary: "La guía oficial para escribir, probar y desplegar contratos. El punto de partida.",
    tags: ["Oficial", "Soroban"],
    links: [{ label: "developers.stellar.org", href: "https://developers.stellar.org/docs/build/smart-contracts" }],
    date: "2026-09-15",
    week: 3,
    order: 1,
  },
  {
    id: "docs-assets",
    title: "Assets: panorama y comparación",
    kind: "documentacion",
    summary:
      "Qué es un asset en Stellar y en qué se diferencian un asset clásico y un token de contrato, para saber cuándo usar cada uno.",
    tags: ["Oficial", "Assets"],
    links: [{ label: "developers.stellar.org", href: "https://developers.stellar.org/docs/tokens/anatomy-of-an-asset" }],
    date: "2026-09-17",
    week: 3,
    order: 2,
  },
  {
    id: "docs-sac",
    title: "Desplegar el Stellar Asset Contract (SAC)",
    kind: "documentacion",
    summary:
      "Receta del CLI para exponer un asset clásico como contrato y usarlo desde Soroban. Es lo que permite que Aex Pass cobre en XLM.",
    tags: ["Oficial", "Stellar CLI", "Assets"],
    links: [
      {
        label: "developers.stellar.org",
        href: "https://developers.stellar.org/docs/tools/cli/cookbook/deploy-stellar-asset-contract",
      },
    ],
    date: "2026-09-17",
    week: 3,
    order: 3,
  },
  {
    id: "docs-openzeppelin",
    title: "OpenZeppelin para Stellar",
    kind: "documentacion",
    summary:
      "Contratos y librerías auditadas para Soroban (tokens, control de acceso, pausas y actualizaciones), para no reinventar lo básico.",
    tags: ["Seguridad", "Tokens"],
    links: [
      { label: "En Stellar Docs", href: "https://developers.stellar.org/docs/tools/openzeppelin-contracts" },
      { label: "Documentación de OpenZeppelin", href: "https://docs.openzeppelin.com/stellar-contracts" },
    ],
    date: "2026-09-17",
    week: 3,
    order: 4,
  },
  {
    id: "docs-solang",
    title: "Solang: qué de Solidity funciona en Soroban",
    kind: "documentacion",
    summary:
      "La tabla de compatibilidad del compilador Solang, que lleva Solidity a Soroban. Útil para quien viene de EVM.",
    tags: ["Solidity", "EVM"],
    links: [
      {
        label: "solang.readthedocs.io",
        href: "https://solang.readthedocs.io/en/latest/targets/soroban_support_matrix.html",
      },
    ],
    date: "2026-09-17",
    week: 3,
    order: 5,
  },
  {
    id: "docs-seps",
    title: "Stellar Ecosystem Proposals (SEPs)",
    kind: "documentacion",
    summary:
      "Los estándares del ecosistema (wallets, anclas, tokens y más) que permiten que las apps de Stellar se entiendan entre sí.",
    tags: ["Oficial", "Estándares"],
    links: [
      {
        label: "developers.stellar.org",
        href: "https://developers.stellar.org/docs/learn/fundamentals/stellar-ecosystem-proposals",
      },
    ],
    date: "2026-09-21",
    week: 4,
    order: 6,
  },
  {
    id: "docs-bindings",
    title: "Generar bindings de TypeScript",
    kind: "documentacion",
    summary:
      "Del tutorial guestbook: cómo generar un cliente TypeScript desde un contrato para llamarlo desde el frontend.",
    tags: ["Oficial", "Frontend", "TypeScript"],
    links: [{ label: "developers.stellar.org", href: "https://developers.stellar.org/docs/build/apps/guestbook/bindings" }],
    date: "2026-09-21",
    week: 4,
    order: 7,
  },
  {
    id: "soroban-sdk-docs",
    title: "Referencia de soroban-sdk",
    kind: "documentacion",
    summary: "La documentación de la librería de Rust para contratos: tipos, storage, auth, tokens y eventos.",
    tags: ["Rust"],
    links: [{ label: "docs.rs", href: "https://docs.rs/soroban-sdk" }],
    date: "2026-09-22",
    week: 4,
    order: 8,
  },

  // ── Repositorios ───────────────────────────────────────────────────
  {
    id: "aex-pass",
    title: "Aex Pass",
    kind: "repositorio",
    origin: "mio",
    summary:
      "El contrato Event Pass en Rust con soroban-sdk: pase para un Meet que se compra una vez y se usa una vez. Incluye sus 7 pruebas y la demo del Stellar CLI.",
    tags: ["Soroban", "Rust", "Testnet"],
    links: [
      { label: "GitHub", href: "https://github.com/latmontecinos-sketch/aex-pass" },
      {
        label: "Contrato",
        href: "https://stellar.expert/explorer/testnet/contract/CCGIRQW6WUR4WT46DTL2EZMQBCY4SNRF622DN2VODMOYGMSFHMDPP6NW",
      },
    ],
    date: "2026-09-22",
    week: 4,
    order: 1,
    task: "aex-pass",
  },
  {
    id: "aex-stellar-lab",
    title: "Aex Stellar Lab",
    kind: "repositorio",
    origin: "mio",
    summary:
      "Este sitio: Next.js 16 y @stellar/stellar-sdk. Aquí viven la biblioteca y la ejecución interactiva de cada tarea, directo contra testnet desde el navegador.",
    tags: ["Next.js", "stellar-sdk"],
    links: [{ label: "GitHub", href: "https://github.com/latmontecinos-sketch/aex-stellar-lab" }],
    date: "2026-09-22",
    week: 4,
    order: 2,
  },
  {
    id: "kosmovia",
    title: "Kosmovia",
    kind: "repositorio",
    origin: "mio",
    summary:
      "Red social para el ecosistema Stellar que construyo con mi equipo de Stellar Elite Bolivia: comunidades, un muro y una billetera integrada. En desarrollo, sobre testnet.",
    tags: ["Equipo", "En desarrollo"],
    links: [
      { label: "GitHub", href: "https://github.com/kosmovia/kosmovia" },
      { label: "Sitio", href: "https://kosmovia.vercel.app" },
    ],
    date: "2026-09-16",
    week: 3,
    order: 3,
  },
  {
    id: "stellar-build",
    title: "Stellar Build",
    kind: "repositorio",
    origin: "mio",
    summary:
      "Repositorio base del programa, creado desde el template oficial stellar-build-toolkit: las skills de Claude Code con las que construyo. Fue mi primer entregable.",
    tags: ["Toolkit", "Claude Code"],
    links: [{ label: "GitHub", href: "https://github.com/latmontecinos-sketch/Stellar-Build" }],
    date: "2026-09-06",
    week: 1,
    order: 4,
  },
  {
    id: "rwa-launchpad",
    title: "RWA Launchpad (bootcamp)",
    kind: "repositorio",
    origin: "comunidad",
    author: "Oppia Software Labs",
    summary:
      "Repo base del bootcamp de contratos de Stellar Bolivia (días 1 a 3): un launchpad de activos del mundo real (RWA) en Soroban, con TypeScript.",
    tags: ["Bootcamp", "RWA", "Soroban"],
    links: [{ label: "GitHub", href: "https://github.com/Oppia-Software-Labs/rwa-launchpad-bootcamp" }],
    date: "2026-09-21",
    week: 4,
    order: 5,
  },
  {
    id: "trustless-work",
    title: "Trustless Work: contrato de escrow",
    kind: "repositorio",
    origin: "comunidad",
    author: "Trustless Work",
    summary:
      "Infraestructura de escrow sin permisos sobre Soroban y USDC que cualquier plataforma puede integrar. Un contrato real en producción para estudiar.",
    tags: ["Escrow", "USDC", "Rust"],
    links: [{ label: "GitHub", href: "https://github.com/Trustless-Work/trustlesswork-smart-contract-stellar" }],
    date: "2026-09-21",
    week: 4,
    order: 6,
  },
  {
    id: "after-stellar",
    title: "afterStellar: Stellar, en criollo",
    kind: "repositorio",
    origin: "comunidad",
    author: "Eli (María Elisa Araya)",
    summary:
      "Conceptos de Stellar explicados de forma simple, hecho por una dev de la comunidad argentina (Office Hours 3, Argentina Builder Challenge). Muy bueno si algún concepto todavía cuesta.",
    tags: ["Conceptos", "Principiantes"],
    links: [{ label: "GitHub", href: "https://github.com/mariaelisaaraya/afterStellar" }],
    date: "2026-09-19",
    week: 3,
    order: 7,
  },
  {
    id: "soroban-examples",
    title: "soroban-examples",
    kind: "repositorio",
    origin: "oficial",
    author: "Stellar",
    summary: "Contratos de ejemplo oficiales: tokens, autorización, eventos, storage y más.",
    tags: ["Oficial", "Soroban"],
    links: [{ label: "GitHub", href: "https://github.com/stellar/soroban-examples" }],
    date: "2026-09-22",
    week: 4,
    order: 8,
  },

  // ── Skills e IA ────────────────────────────────────────────────────
  {
    id: "raven",
    title: "Stellar Raven",
    kind: "skill",
    summary:
      "Servidor MCP de Stellar para agentes de IA: con una sola conexión, el agente tiene la documentación, datos en vivo del ecosistema y guías probadas.",
    tags: ["MCP", "IA"],
    links: [{ label: "raven.stellar.buzz", href: "https://raven.stellar.buzz/" }],
    date: "2026-09-21",
    week: 4,
    order: 0,
  },
  skill("smart-contracts", "Contratos en Rust con soroban-sdk: estructura, storage, autorización, pruebas y seguridad.", 1),
  skill("dapp", "Frontends que llaman contratos con el SDK de JavaScript y wallets.", 2),
  skill("assets", "Assets clásicos, trustlines y el puente SAC hacia los contratos.", 3),
  skill("data", "Consultar datos de la red vía Stellar RPC y Horizon.", 4),
  skill("standards", "SEPs, CAPs y referencias del ecosistema.", 5),
  skill("deploy-stellar-mainnet", "Checklist para pasar de testnet a mainnet.", 6),
  skill("agentic-payments", "Pagos entre máquinas y APIs pagas (x402).", 7),
  skill("zk-proofs", "Pruebas de conocimiento cero y patrones de privacidad.", 8),
  skill("find-stellar-idea", "Descubrir qué construir sobre Stellar.", 9),
  skill("stellar-competitive-landscape", "Mapear la competencia de una idea en el ecosistema.", 10),
  skill("scf-round-watcher", "Seguir las rondas del Stellar Community Fund.", 11),
  skill("stellar-help", "Qué skill usar según en qué etapa está el proyecto.", 12),

  // ── Herramientas ───────────────────────────────────────────────────
  {
    id: "stellar-cli",
    title: "Stellar CLI",
    kind: "herramienta",
    summary: "La herramienta oficial de terminal para compilar, desplegar e invocar contratos. Uso la versión 28.",
    tags: ["Terminal"],
    links: [{ label: "Manual", href: "https://developers.stellar.org/docs/tools/cli/stellar-cli" }],
    date: "2026-09-22",
    week: 4,
    order: 1,
  },
  {
    id: "stellar-lab",
    title: "Stellar Lab",
    kind: "herramienta",
    summary: "Herramienta web oficial para crear cuentas, armar transacciones e invocar contratos sin terminal.",
    tags: ["Oficial", "Web"],
    links: [{ label: "lab.stellar.org", href: "https://lab.stellar.org" }],
    date: "2026-09-22",
    week: 4,
    order: 2,
  },
  {
    id: "stellar-expert",
    title: "stellar.expert",
    kind: "herramienta",
    summary: "Explorador de la blockchain: cuentas, transacciones, contratos, eventos y storage.",
    tags: ["Explorador"],
    links: [{ label: "Testnet", href: "https://stellar.expert/explorer/testnet" }],
    date: "2026-09-22",
    week: 4,
    order: 3,
  },
  {
    id: "rust-wasm",
    title: "Rust + wasm32v1-none",
    kind: "herramienta",
    summary: "El lenguaje de los contratos y el target que los compila al WebAssembly que corre la red.",
    tags: ["Rust"],
    links: [{ label: "rustup", href: "https://rustup.rs" }],
    date: "2026-09-22",
    week: 4,
    order: 4,
  },
  {
    id: "stellar-sdk-js",
    title: "@stellar/stellar-sdk",
    kind: "herramienta",
    summary: "El SDK de JavaScript. En este sitio despliega e invoca contratos desde el navegador.",
    tags: ["JavaScript"],
    links: [{ label: "npm", href: "https://www.npmjs.com/package/@stellar/stellar-sdk" }],
    date: "2026-09-22",
    week: 4,
    order: 5,
  },
  {
    id: "friendbot",
    title: "Friendbot",
    kind: "herramienta",
    summary: "El servicio de testnet que regala XLM de prueba para fondear cuentas nuevas.",
    tags: ["Testnet"],
    links: [
      {
        label: "Documentación",
        href: "https://developers.stellar.org/docs/learn/fundamentals/networks#friendbot",
      },
    ],
    date: "2026-09-22",
    week: 4,
    order: 6,
  },

  // ── Lecturas ───────────────────────────────────────────────────────
  {
    id: "tellus-green-pill-5",
    title: "Tellus Green Pill N°5",
    kind: "lectura",
    author: "Tellus",
    summary:
      "Resumen de dos semanas del ecosistema: el dólar más usado llega a Stellar, un nuevo hub en Santiago y quiénes están enseñando a los agentes de IA a construir en la red.",
    tags: ["Newsletter", "Ecosistema"],
    links: [
      {
        label: "Leer",
        href: "https://blog.telluscoop.com/p/tellus-green-pill-n-5-una-dosis-el-nico-resumen-que-necesitas",
      },
    ],
    date: "2026-09-17",
    week: 3,
    order: 1,
  },
  {
    id: "post-dia-2",
    title: "Día 2: autorización y estados",
    kind: "lectura",
    author: "Juan José Valencia",
    summary: "Resumen del segundo día del bootcamp, escrito por un compañero del programa.",
    tags: ["Bootcamp", "LinkedIn"],
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/posts/juan-jose-valencia-45986813_d%C3%ADa-2-iniciamos-con-autorizacion-estados-ugcPost-7506686224733184000-Yk9v",
      },
    ],
    date: "2026-09-18",
    week: 3,
    order: 2,
  },
  {
    id: "post-semana-3",
    title: "Terminamos la semana 3 publicando un smart contract",
    kind: "lectura",
    author: "Juan José Valencia",
    summary: "Cierre de la tercera semana del programa, escrito por un compañero.",
    tags: ["Bootcamp", "LinkedIn"],
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/posts/juan-jose-valencia-45986813_terminamos-la-3-semana-publicando-smart-contract-ugcPost-7508106057219727361-dKL1",
      },
    ],
    date: "2026-09-22",
    week: 4,
    order: 3,
  },

  // ── Comunidad y oportunidades ──────────────────────────────────────
  {
    id: "stellar-bolivia-ig",
    title: "Stellar Bolivia",
    kind: "comunidad",
    summary: "La comunidad de Stellar en Bolivia: novedades, eventos y convocatorias.",
    tags: ["Bolivia", "Instagram"],
    links: [{ label: "Instagram", href: "https://www.instagram.com/stellar_bolivia/" }],
    date: "2026-09-18",
    week: 3,
    order: 1,
  },
  {
    id: "meridian-2026",
    title: "Meridian 2026 en Lisboa",
    kind: "comunidad",
    summary: "La conferencia anual de Stellar. Compartieron la convocatoria para postular y viajar.",
    tags: ["Conferencia", "Convocatoria"],
    links: [
      { label: "Sitio oficial", href: "https://meridian.stellar.org" },
      { label: "Convocatoria", href: "https://www.instagram.com/p/DdZRkuZRHrr/" },
    ],
    date: "2026-09-19",
    week: 3,
    order: 2,
  },
  {
    id: "becas-ubc",
    title: "Becas UBC 2026 (BAF)",
    kind: "comunidad",
    author: "BAF",
    summary:
      "BAF lleva estudiantes de Latinoamérica a la University Blockchain Conference en Austin, Texas: más de 1.000 estudiantes de 100 universidades.",
    tags: ["Beca", "Convocatoria"],
    links: [
      { label: "Postular", href: "https://becas-ubc.vercel.app" },
      { label: "Anuncio", href: "https://x.com/TheBAFNetwork/status/2102182483773018289" },
    ],
    date: "2026-09-21",
    week: 4,
    order: 3,
  },
];

export const tasks: Task[] = [
  {
    slug: "aex-pass",
    title: "Invocación de un contrato: Event Pass",
    track: "Event Pass",
    week: 3,
    due: "2026-09-17",
    status: "entregado",
    statusNote: "En revisión",
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

/** Orden dentro de una sección: por `order` y, si falta, lo más reciente primero. */
export function byOrder(a: Entry, b: Entry): number {
  return (a.order ?? 999) - (b.order ?? 999) || b.date.localeCompare(a.date);
}
