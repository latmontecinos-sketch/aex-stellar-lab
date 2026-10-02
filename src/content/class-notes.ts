// Apuntes de clase: salen de mi app que estudia los videos y los reviso antes de
// publicarlos. Cada uno cuelga de una clase de la biblioteca por su id y tiene su
// página en /biblioteca/clase/<id>. Los tiempos `t` van en segundos del video.

export type ClassNotes = {
  /** Id de la clase en library.ts. */
  session: string;
  /** Fecha en que lo estudié, AAAA-MM-DD. */
  studied: string;
  summary: string;
  overview: string[];
  topics: { title: string; t: number; text: string; points: string[] }[];
  concepts: { term: string; t: number; text: string }[];
  commands: { code: string; t: number; text: string }[];
  questions: { q: string; a: string }[];
  takeaways: string[];
};

export const classNotes: ClassNotes[] = [
  {
    session: "clase-vibe-coding",
    studied: "2026-10-02",
    summary:
      "Qué son los MCPs, las skills y el vibe coding, y cómo se usan en Stellar. Se configura Cursor con agentes de IA para armar un proyecto desde cero, más rápido.",
    overview: [
      "Antes de usar IA, define bien el objetivo y el alcance del proyecto.",
      "Las skills, los MCPs y los plugins conectan al agente con las herramientas de Stellar.",
      "Cuatro productos del ecosistema trabajan juntos: Reflector, Pollar, Trustless Work y Soroswap.",
      "Demo en vivo: configurar el entorno con Cursor y agentes de IA.",
    ],
    topics: [
      {
        title: "Tener claro el objetivo",
        t: 0,
        text: "Si la meta está clara, la IA no divaga ni toma caminos equivocados.",
        points: [
          "Define qué quieres obtener del modelo.",
          "Acota el objetivo principal para que la IA no se desvíe.",
          "Evita que repita el producto en ramas que no hacen falta.",
        ],
      },
      {
        title: "Skills, MCPs y plugins en Cursor",
        t: 224,
        text: "Cómo moverse entre skills, MCPs y plugins en Cursor para conectar herramientas y crear un proyecto desde cero.",
        points: [
          "Cursor conecta las herramientas y crea el proyecto.",
          "Las guías de integración le dan contexto al agente.",
          "El código vive en un repositorio de GitHub.",
        ],
      },
      {
        title: "Reflector, Pollar, Trustless Work y Soroswap",
        t: 312,
        text: "Los cuatro productos del ecosistema que se usan juntos en el proyecto.",
        points: [
          "Reflector: precios en vivo con un oráculo.",
          "Pollar: el onboarding, las wallets y los providers.",
          "Trustless Work: escrows para pagos seguros.",
          "Soroswap: intercambio de tokens.",
        ],
      },
      {
        title: "Configurar MCPs y el prompt del proyecto",
        t: 524,
        text: "Los servidores MCP se configuran en mcp.json, y un prompt largo guía al agente en la arquitectura y la tecnología.",
        points: [
          "Las API keys y los endpoints van en mcp.json.",
          "Un prompt largo y ordenado guía al agente en arquitectura y tecnología.",
          "Stack: monorepo con Turborepo, Bun y Next.js.",
        ],
      },
      {
        title: "Vibe coding con agentes",
        t: 4010,
        text: "Delegar tareas grandes a agentes, comparar herramientas y cuidar el consumo de tokens.",
        points: [
          "Delega y ordena el trabajo: tú diriges, el agente escribe.",
          "Vigila el consumo de tokens y los límites de cada modelo.",
          "Suma la documentación oficial con skills y MCPs.",
        ],
      },
    ],
    concepts: [
      {
        term: "MCP (Model Context Protocol)",
        t: 228,
        text: "Conecta a un agente de IA con datos, documentación y herramientas externas.",
      },
      {
        term: "Skill",
        t: 270,
        text: "Un paquete de instrucciones que le da a la IA el contexto de un framework, un SDK o un protocolo.",
      },
      {
        term: "Oráculo (Reflector)",
        t: 335,
        text: "Trae precios en tiempo real para apps descentralizadas y marketplaces.",
      },
      {
        term: "Escrow",
        t: 673,
        text: "Guarda fondos y los libera solo cuando se cumple lo acordado en el contrato.",
      },
      {
        term: "Vibe coding",
        t: 4053,
        text: "Programar dirigiendo a la IA: tú orquestas y ella escribe el código.",
      },
    ],
    commands: [
      {
        code: "npx skills add Bran18/reflector-skill",
        t: 1790,
        text: "Instala una skill directo desde su repo de GitHub.",
      },
      {
        code: "npx skills update",
        t: 2095,
        text: "Actualiza las skills instaladas a su última versión.",
      },
    ],
    questions: [
      {
        q: "¿Qué hace Reflector en Stellar?",
        a: "Es un oráculo: da precios y datos de mercado en tiempo real.",
      },
      {
        q: "¿Para qué sirve mcp.json en Cursor?",
        a: "Para configurar y conectar los servidores MCP que le dan contexto a la IA.",
      },
      {
        q: "¿Qué es una skill?",
        a: "Una guía con todo el contexto sobre una tecnología, un SDK o un protocolo, para que el agente la use bien.",
      },
      {
        q: "¿Para qué se usa Pollar?",
        a: "Para el onboarding y la conexión con wallets y providers en apps de Stellar.",
      },
      {
        q: "¿Qué stack se usó para el monorepo?",
        a: "Turborepo y Bun.",
      },
    ],
    takeaways: [
      "Los MCPs y las skills le dan al agente documentación y contexto precisos: integrar cuesta mucho menos.",
      "Con un objetivo claro y un prompt ordenado, la IA escribe código que respeta la arquitectura.",
      "Pollar, Reflector y Trustless Work facilitan armar apps financieras en Stellar.",
    ],
  },
];

export function notesFor(session: string): ClassNotes | undefined {
  return classNotes.find((n) => n.session === session);
}

/** "1:06:50" o "03:44", como en YouTube. */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
