// Kosmovia, el proyecto de equipo en Stellar Elite Bolivia. Solo lo que ya es
// público en su landing y en su repo; si el plan cambia allá, se cambia aquí.

export const kosmovia = {
  site: "https://kosmovia.vercel.app",
  repo: "https://github.com/kosmovia/kosmovia",
  tagline: "Explora. Conecta. Pertenece.",
  pitch: "Una red social gratuita para Stellar: comunidades, un muro, una billetera integrada y mini apps adentro.",
  status: "En desarrollo · solo testnet",
  features: [
    { title: "Comunidades", text: "Canales, hilos, roles y mensajes directos." },
    { title: "Un muro", text: "Lo que publican tus comunidades y la gente que sigues." },
    { title: "Billetera desde el día uno", text: "Se crea al registrarte. Sin frases semilla, sin extensiones, sin pagar comisiones." },
    { title: "Mini apps adentro", text: "Apps que se abren desde un post y cobran en USDC." },
  ],
  // Las etapas A a D tienen fecha; de la E en adelante, todavía no.
  stages: [
    { id: "A", title: "Base social", text: "Identidad, comunidades, canales y chat", when: "Sep – Oct" },
    { id: "B", title: "Muro", text: "Posts, seguir, Inicio y Explorar", when: "Oct – Nov" },
    { id: "C", title: "Billetera", text: "Billetera al registrarte y propinas por @usuario", when: "Nov – Dic" },
    { id: "D", title: "Pagos", text: "Entradas, pozos y sorteos en una comunidad", when: "Dic – Ene" },
    { id: "E", title: "Mini apps", text: "Apps que corren adentro, abiertas desde un post", when: "Sin fecha" },
    { id: "F", title: "Abierto a otros", text: "Un SDK para que cualquiera publique su app", when: "Sin fecha" },
    { id: "G", title: "Escala", text: "Mainnet, móvil y retiro a efectivo", when: "Sin fecha" },
  ],
  myRole: "Producto y full stack: la landing, los servicios que unen las piezas y los despliegues.",
  teamSize: 4,
} as const;
