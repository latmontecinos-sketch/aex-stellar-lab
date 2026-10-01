# Aex Stellar Lab

Una biblioteca personal de lo que voy aprendiendo en **Stellar Elite Bolivia**: los repositorios que construyo, mis apuntes, los recursos y herramientas que uso, y las tareas del programa, cada una con su ejecución y su explicación.

**Sitio:** https://aex-stellar-lab.vercel.app

## Secciones

| Ruta | Qué hay |
|---|---|
| `/` | Resumen: cuántas entradas hay, las tareas y lo último agregado |
| `/biblioteca` | Todo ordenado en 8 secciones, con filtros por sección (`?tipo=clase`), por semana (`?semana=4`) y búsqueda |
| `/tareas` | Las tareas del programa |
| `/kosmovia` | Kosmovia, el proyecto de mi equipo (solo lo que ya es público) |
| `/tareas/aex-pass` | Tarea Event Pass: consigna, checklist del entregable y qué sigo aprendiendo |
| `/tareas/aex-pass/ejecucion` | Los 11 pasos reales con el Stellar CLI y el flujo para ejecutarlo desde el navegador |
| `/tareas/aex-pass/explicacion` | Cómo funciona: reglas, recorrido de un pase, funciones, storage, errores y costos |
| `/tareas/rwa-launchpad` | Tarea final: RWA Launchpad con inversión mínima de 500, consigna y checklist del entregable |
| `/tareas/rwa-launchpad/ejecucion` | El flujo con los scripts del repo en testnet y el mismo flujo desde el navegador |
| `/tareas/rwa-launchpad/explicacion` | Cómo funciona: la regla, las cuentas del precio, el rechazo, los errores y los tests |

## Agregar contenido

El contenido está en [`src/content/`](src/content):

- **Una entrada de la biblioteca:** sumar un objeto a `library` en [`library.ts`](src/content/library.ts), con su sección en `kind` (`clase`, `apunte`, `documentacion`, `repositorio`, `skill`, `herramienta`, `lectura` o `comunidad`), título, resumen, etiquetas, links, fecha y semana del programa. Opcionales: `author`, `origin` (repos: `mio`, `comunidad` u `oficial`), `video` (id de YouTube, muestra la miniatura), `order` y `task` (slug de la tarea relacionada). El tipo `Entry` está en [`schema.ts`](src/content/schema.ts).
- **La semana actual:** `site.currentWeek` en `schema.ts`. La portada muestra lo nuevo de esa semana.
- **Una tarea nueva:** sumar un objeto a `tasks` en [`tasks.ts`](src/content/tasks.ts) y crear su carpeta en `src/app/tareas/<slug>/`, con `layout.tsx` (usa `TaskLayout`, que arma el encabezado y las pestañas), `page.tsx` (resumen, con `TaskVideo` y `DeliverableChecklist`), `ejecucion/` y `explicacion/`. Las de `aex-pass` y `rwa-launchpad` sirven de plantilla.

Los datos de cada contrato (ids, hashes, transacciones, comisiones, errores) están una sola vez: los de Aex Pass en [`src/lib/deployment.ts`](src/lib/deployment.ts) y los del RWA Launchpad en [`src/lib/rwa-deployment.ts`](src/lib/rwa-deployment.ts). Las páginas y la biblioteca los importan de ahí.

Cada push a `main` se publica solo en Vercel.

## Desarrollo

Next.js 16, React 19, Tailwind 4 y `@stellar/stellar-sdk`. La ejecución interactiva corre en el navegador contra Stellar testnet: no hay servidor ni base de datos. El SDK se descarga recién cuando la demo lo usa.

```bash
pnpm install
pnpm dev            # http://127.0.0.1:3000
pnpm check          # lint + typecheck + tests + build: lo mismo que corre CI
pnpm test:testnet   # prueba de integración contra testnet (crea cuentas y despliega; no compra ni invierte)
```

| Carpeta | Qué hay |
|---|---|
| `src/lib/format.ts` | Montos en stroops (`bigint`), sin números de coma flotante. Con tests |
| `src/lib/stellar.ts` | Todo lo que habla con la red. Una transacción cuenta como hecha solo si la red responde `SUCCESS` |
| `src/lib/rwa.ts` | Lo que habla con el RWA Launchpad; reusa el firmado y envío de `stellar.ts` |
| `src/lib/aex-pass-contract.ts`, `src/lib/rwa-contract.ts` | Clientes tipados de los contratos, generados con `stellar contract bindings typescript` |
| `src/components/aex-pass/`, `src/components/rwa/` | Las demos interactivas; comparten los pasos (`step.tsx`) y la sesión en `localStorage` (`local-store.ts`) |

Los contratos viven en [latmontecinos-sketch/aex-pass](https://github.com/latmontecinos-sketch/aex-pass) y en [latmontecinos-sketch/rwa-launchpad-bootcamp](https://github.com/latmontecinos-sketch/rwa-launchpad-bootcamp) (`dia-3`).

---

**Alejandro Tintaya Montecinos** — La Paz, Bolivia · [latmontecinos.vercel.app](https://latmontecinos.vercel.app)
