// Tipos, configuración del sitio y helpers del contenido. Las entradas viven en
// library.ts y las tareas en tasks.ts.

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
  /** Id de la clase en la que se compartió: en la vista por semana va debajo de ella. */
  session?: string;
  /** Por qué quizás ya no sirve. Si está, la entrada va a "En revisión" y no se cuenta. */
  review?: string;
};

export type TaskStatus = "pendiente" | "en-progreso" | "entregado";

export type Task = {
  slug: string;
  title: string;
  track: string;
  week: number;
  /** Fecha de entrega, AAAA-MM-DD, si el programa la publicó. */
  due?: string;
  status: TaskStatus;
  statusNote?: string;
  summary: string;
  /** Nombre de mi solución y una frase que la explica. */
  project: string;
  pitch: string;
  /** Id del archivo del video del entregable en Google Drive. */
  videoDriveId?: string;
};

export const site = {
  name: "Aex Stellar Lab",
  tagline: "Una biblioteca personal de lo que voy aprendiendo",
  program: "Stellar Elite Bolivia · 2026",
  currentWeek: 5,
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

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  "en-progreso": "En progreso",
  entregado: "Entregado",
};

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** La semana 1 del programa empezó el lunes 31 de agosto de 2026. */
const PROGRAM_START = Date.UTC(2026, 7, 31);
const DAY = 86_400_000;

/** Lunes a domingo de una semana del programa, por ejemplo "28 sep – 4 oct". */
export function weekRange(week: number): string {
  const day = (offset: number) => {
    const date = new Date(PROGRAM_START + ((week - 1) * 7 + offset) * DAY);
    return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
  };
  return `${day(0)} – ${day(6)}`;
}

/** Orden dentro de una sección: por `order` y, si falta, lo más reciente primero. */
export function byOrder(a: Entry, b: Entry): number {
  return (a.order ?? 999) - (b.order ?? 999) || b.date.localeCompare(a.date);
}

export function formatDue(task: Task): string {
  return task.due ? formatDate(task.due) : "por confirmar";
}

/** Las tareas más recientes primero; las que no tienen fecha, arriba de todo. */
export function byDueDesc(a: Task, b: Task): number {
  return (b.due ?? "9999").localeCompare(a.due ?? "9999") || b.week - a.week;
}
