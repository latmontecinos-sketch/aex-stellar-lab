import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Aex Pass · Cómo funciona",
  description: "Las reglas de Aex Pass, el recorrido de un pase, sus funciones, qué guarda en la blockchain y cuánto cuesta.",
};

const characters = [
  { icon: "🎤", name: "Anfitrión", text: "Organiza el Meet, cobra el pase y deja entrar a la gente." },
  { icon: "🙋", name: "Invitado", text: "Compra su pase y lo usa para entrar." },
  { icon: "📜", name: "Contrato", text: "Las reglas del evento, guardadas en la blockchain. Nadie se las puede saltar." },
];

const functions = [
  {
    name: "__constructor(host, token, price, name)",
    signer: "El anfitrión, al desplegar",
    does: "Guarda las reglas del evento: quién cobra, con qué activo, cuánto y cómo se llama. Corre una sola vez.",
    cost: "Comisión de despliegue",
  },
  {
    name: "buy(buyer)",
    signer: "El invitado",
    does: "Cobra el precio, se lo paga al anfitrión, anota el pase como Bought y publica el evento bought.",
    cost: "Comisión + renta",
  },
  {
    name: "check_in(buyer)",
    signer: "El anfitrión",
    does: "Pasa el pase de Bought a Used y publica el evento checked_in.",
    cost: "Comisión",
  },
  {
    name: "pass_of(buyer)",
    signer: "Nadie",
    does: "Devuelve el estado del pase de esa cuenta: sin pase, Bought o Used.",
    cost: "Gratis (lectura)",
  },
  {
    name: "name() · price() · host()",
    signer: "Nadie",
    does: "Devuelven la configuración del evento.",
    cost: "Gratis (lectura)",
  },
];

const errors = [
  { code: 1, name: "InvalidPrice", when: "Se intenta crear el evento con un precio de cero o menos." },
  { code: 2, name: "AlreadyBought", when: "Una cuenta que ya tiene pase intenta comprar otro." },
  { code: 3, name: "NoPass", when: "El anfitrión intenta dejar entrar a alguien que no compró." },
  { code: 4, name: "AlreadyUsed", when: "Se intenta usar un pase que ya se usó." },
];

const glossary = [
  { term: "Blockchain", text: "Un registro público y compartido que nadie puede editar a escondidas. Stellar es una blockchain." },
  { term: "Testnet (red de prueba)", text: "Una copia de Stellar para practicar. Funciona igual que la real, pero el XLM no vale dinero." },
  { term: "Contrato", text: "Un programa que vive en la blockchain y aplica reglas por sí solo." },
  { term: "Stellar CLI", text: "La herramienta oficial de Stellar para la terminal: compila, publica y usa contratos con comandos." },
  { term: "Invocar", text: "Llamar a una función de un contrato, como buy (comprar) o check_in (dejar entrar)." },
  { term: "Cuenta", text: "Una dirección pública (empieza con G) y una llave secreta. La dirección se puede compartir; la llave no." },
  { term: "Firmar", text: "Aprobar una operación con la llave secreta. El contrato comprueba que firmó la persona correcta." },
  { term: "Transacción", text: "Un pedido enviado a la red, como «comprar pase». Queda registrado para siempre y se ve en el explorador." },
  { term: "Simular", text: "Probar una transacción antes de enviarla. Si la simulación falla, no se envía y no se cobra nada." },
  { term: "Evento", text: "Un aviso público que deja el contrato cuando pasa algo: bought (compró) y checked_in (entró)." },
  { term: "Storage (almacenamiento)", text: "Los datos que guarda el contrato en la red. Guardarlos tiene un costo: la renta." },
  { term: "TTL", text: "El tiempo de vida de un dato guardado. Mientras más largo, más renta se paga." },
  { term: "XLM y stroops", text: "XLM es la moneda de Stellar. Un stroop es su unidad mínima: 1 XLM son 10.000.000 stroops." },
  { term: "Explorador", text: "Una página que muestra todo lo que pasa en la blockchain. Aquí usamos stellar.expert." },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-6">
      <h2 id={`${id}-titulo`} className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <code className="font-mono text-[0.9em]">{children}</code>;
}

function StateBox({ label, tone }: { label: string; tone: "idle" | "accent" | "ok" | "bad" }) {
  const styles = {
    idle: "border-border bg-surface text-text",
    accent: "border-accent bg-accent-soft text-accent",
    ok: "border-ok bg-ok-soft text-ok",
    bad: "border-bad bg-bad-soft text-bad",
  }[tone];
  return (
    <div className={`rounded-xl border-2 px-4 py-3 text-center font-semibold ${styles}`}>{label}</div>
  );
}

function Arrow({ action, detail }: { action: string; detail: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-2 py-2 text-center md:py-0">
      <span className="font-mono text-sm font-semibold">{action}</span>
      <span className="text-xs text-muted">{detail}</span>
      <span aria-hidden className="text-xl text-muted md:hidden">
        ↓
      </span>
      <span aria-hidden className="hidden text-xl text-muted md:block">
        →
      </span>
    </div>
  );
}

const TOC = [
  { id: "idea", label: "La idea" },
  { id: "reglas", label: "Las dos reglas" },
  { id: "recorrido", label: "El recorrido de un pase" },
  { id: "funciones", label: "Qué hace cada función" },
  { id: "que-guarda", label: "Qué guarda en la blockchain" },
  { id: "errores", label: "Cuando algo sale mal" },
  { id: "costos", label: "Cuánto cuesta" },
  { id: "glosario", label: "Glosario" },
];

export default function AexPassExplanation() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <nav aria-label="En esta página" className="hidden lg:block">
        <ul className="sticky top-6 space-y-2 text-sm">
          {TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-muted hover:text-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-w-0 max-w-3xl flex-col gap-14">
        <Section id="idea" title="La idea">
          <p className="leading-relaxed text-muted">
            Organizar un Meet pagado tiene dos problemas: saber quién pagó y evitar que un mismo pase se use dos
            veces. Normalmente eso lo controla una planilla o un servidor del organizador, y hay que confiar en
            él. Aex Pass pone esas reglas en un <strong className="text-text">contrato</strong>: un programa
            público en la blockchain que las aplica solo y que nadie puede cambiar, ni siquiera el anfitrión.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {characters.map((c) => (
              <li key={c.name} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
                <span aria-hidden className="text-2xl">
                  {c.icon}
                </span>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="reglas" title="Las dos reglas">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-accent">Regla 1</p>
              <p className="mt-1 text-lg font-semibold">Solo tiene pase quien lo compró</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <Mono>buy</Mono> exige la firma del comprador y cobra en la misma operación: o se paga y se anota
                el pase, o no pasa nada. Cada cuenta puede comprar un solo pase.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-accent">Regla 2</p>
              <p className="mt-1 text-lg font-semibold">Cada pase se usa una sola vez</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <Mono>check_in</Mono> solo lo puede firmar el anfitrión, y solo acepta un pase comprado. Un pase
                usado se rechaza siempre, lo intente quien lo intente.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            ¿Cómo sabe el contrato quién es el anfitrión? Lo guardó al nacer. No lo recibe como dato en cada
            llamada, así que nadie puede hacerse pasar por él.
          </p>
        </Section>

        <Section id="recorrido" title="El recorrido de un pase">
          <p className="leading-relaxed text-muted">
            Cada cuenta tiene un pase que pasa por tres estados. Solo se puede avanzar, nunca volver atrás.
          </p>
          <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
            <div className="grid items-center gap-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
              <StateBox label="Sin pase" tone="idle" />
              <Arrow action="buy" detail="firma el invitado · paga 1 XLM" />
              <StateBox label="Comprado" tone="accent" />
              <Arrow action="check_in" detail="firma el anfitrión" />
              <StateBox label="Usado" tone="ok" />
              <Arrow action="check_in" detail="otra vez" />
              <StateBox label="Rechazado #4" tone="bad" />
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li>
              Si alguien sin pase intenta entrar, <Mono>check_in</Mono> lo rechaza con el error 3.
            </li>
            <li>
              Si alguien que ya compró intenta comprar otra vez, <Mono>buy</Mono> lo rechaza con el error 2.
            </li>
          </ul>
        </Section>

        <Section id="funciones" title="Qué hace cada función">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Función</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Quién firma</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Qué hace</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Costo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {functions.map((f) => (
                  <tr key={f.name} className="align-top">
                    <th scope="row" className="px-4 py-3 font-mono text-xs font-semibold">{f.name}</th>
                    <td className="px-4 py-3 text-muted">{f.signer}</td>
                    <td className="px-4 py-3 text-muted">{f.does}</td>
                    <td className="px-4 py-3 text-muted">{f.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            El contrato está escrito en Rust con <Mono>soroban-sdk</Mono>, compilado a WebAssembly y publicado en
            Stellar testnet. El código completo tiene unas 160 líneas y está en{" "}
            <a
              href="https://github.com/latmontecinos-sketch/aex-pass/blob/main/src/lib.rs"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent hover:underline"
            >
              GitHub ↗
            </a>
            .
          </p>
        </Section>

        <Section id="que-guarda" title="Qué guarda en la blockchain">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-semibold">Las reglas del evento</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Anfitrión, activo, precio y nombre. Se escriben una vez, al desplegar, en el storage de la
                instancia del contrato.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-semibold">Un dato por cada pase</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                <Mono>Pass(dirección) = Bought</Mono> o <Mono>Used</Mono>, en el storage persistente. Es lo que
                consulta <Mono>pass_of</Mono>.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-semibold">Eventos</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                <Mono>bought</Mono> (quién compró y a qué precio) y <Mono>checked_in</Mono> (quién entró). Son
                avisos para que otras apps se enteren; el estado real está en el storage.
              </p>
            </div>
            <div className="rounded-2xl border border-bad bg-bad-soft p-5">
              <p className="font-semibold">Lo que no guarda: el link del Meet</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Todo lo que está en la blockchain lo puede leer cualquiera. El anfitrión comparte el link por
                fuera; el contrato solo prueba quién pagó y quién entró.
              </p>
            </div>
          </div>
        </Section>

        <Section id="errores" title="Cuando algo sale mal">
          <p className="leading-relaxed text-muted">
            Antes de enviar una transacción, el CLI o la página la <strong className="text-text">simula</strong>.
            Si el contrato la rechaza, la simulación falla con un código de error y la transacción no se envía:
            no queda registrada y no se cobra nada.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Código</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Nombre</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Cuándo pasa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {errors.map((e) => (
                  <tr key={e.code}>
                    <th scope="row" className="px-4 py-3 font-mono font-semibold">#{e.code}</th>
                    <td className="px-4 py-3 font-mono text-xs">{e.name}</td>
                    <td className="px-4 py-3 text-muted">{e.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="costos" title="Cuánto cuesta">
          <p className="leading-relaxed text-muted">
            Cada transacción paga una comisión a la red. Estas son las reales de mi ejecución con el CLI:
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Desplegar", value: "0,011 XLM" },
              { label: "Comprar", value: "17,64 XLM" },
              { label: "Check-in", value: "0,00076 XLM" },
              { label: "Leer", value: "Gratis" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-surface p-4">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-1 text-xl font-bold">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 leading-relaxed text-muted">
            ¿Por qué la compra costó tanto? Guardar datos en la red cuesta <strong className="text-text">renta</strong>,
            y cada dato tiene un tiempo de vida (<strong className="text-text">TTL</strong>). <Mono>buy</Mono>{" "}
            extiende ese tiempo a 120 días para el pase, el contrato y su código, y casi toda la comisión fue esa
            renta. Es XLM de prueba, pero la lección es real: el plazo hay que ajustarlo a la duración del evento.
          </p>
        </Section>

        <Section id="glosario" title="Glosario">
          <dl className="grid gap-3 sm:grid-cols-2">
            {glossary.map((g) => (
              <div key={g.term} className="rounded-2xl border border-border bg-surface p-4">
                <dt className="font-semibold">{g.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{g.text}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  );
}
