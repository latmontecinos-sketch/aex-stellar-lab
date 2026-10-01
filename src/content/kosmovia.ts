// Kosmovia, el proyecto de equipo en Stellar Elite Bolivia. Solo lo que ya es
// público en su landing (kosmovia.vercel.app/es) y en su repo; si el plan
// cambia allá, se cambia aquí.

export const kosmovia = {
  site: "https://kosmovia.vercel.app/es",
  repo: "https://github.com/kosmovia/kosmovia",
  deck: "https://kosmovia.vercel.app/es/pitch",
  tagline: "Explora. Conecta. Pertenece.",
  pitch: "Comunidades con wallet y pagos integrados, en Stellar. Para personas, builders y empresas: empieza en Bolivia, pensado para el mundo.",
  status: "En desarrollo · solo testnet",
  features: [
    { title: "Comunidades", text: "Canales, roles y chat. Las crean personas, builders o empresas." },
    { title: "Wallet desde el primer día", text: "Entras con Google o email y tu wallet en USDC ya está lista. Sin frases semilla ni comisiones." },
    { title: "Pagos y envíos", text: "Envía dinero por @usuario, cobra con un link o QR y cierra tratos con contratos de garantía." },
    { title: "Empresas verificadas", text: "Bancos, fintechs y otras empresas abren sus propias comunidades." },
  ],
  // A–D en octubre de 2026; lo demás en 2027. `now` marca la etapa en curso.
  stages: [
    { id: "A", title: "Comunidades + wallet", text: "Entrar con Google o email, wallet en USDC, comunidades y chat", when: "Ahora", now: true },
    { id: "B", title: "Explorar", text: "Descubrir comunidades, perfiles y lo que está pasando", when: "Oct 2026", now: false },
    { id: "C", title: "Pagos", text: "Envíos y cobros por @usuario, contratos de garantía y pagos divididos", when: "Oct 2026", now: false },
    { id: "D", title: "Empresas verificadas", text: "Verificación (KYC), comunidades de empresas y conexión por API", when: "Oct 2026", now: false },
    { id: "E", title: "Mini apps", text: "Apps que corren adentro, abiertas desde una publicación", when: "2027", now: false },
    { id: "F", title: "Abierto a otros", text: "Un SDK público para que cualquiera publique su app", when: "2027", now: false },
    { id: "G", title: "Más allá de Bolivia", text: "Más países, mainnet y rampas de efectivo", when: "2027", now: false },
  ],
  myRole: "Producto y backend: la wallet, los pagos y los despliegues.",
  teamSize: 4,
} as const;
