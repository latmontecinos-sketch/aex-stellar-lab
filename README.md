# Aex Stellar Lab

Una biblioteca personal de lo que voy aprendiendo en **Stellar Elite Bolivia**: los repositorios que construyo, mis apuntes, los recursos y herramientas que uso, y las tareas del programa, cada una con su ejecución y su explicación.

**Sitio:** https://aex-stellar-lab.vercel.app

## Secciones

| Ruta | Qué hay |
|---|---|
| `/` | Resumen: cuántas entradas hay, las tareas y lo último agregado |
| `/biblioteca` | Todo ordenado en 8 secciones, con filtros por sección (`?tipo=clase`), por semana (`?semana=4`) y búsqueda |
| `/tareas` | Las tareas del programa |
| `/tareas/aex-pass` | Tarea Event Pass: consigna, checklist del entregable y qué sigo aprendiendo |
| `/tareas/aex-pass/ejecucion` | Los 11 pasos reales con el Stellar CLI y el flujo para ejecutarlo desde el navegador |
| `/tareas/aex-pass/explicacion` | Cómo funciona: reglas, recorrido de un pase, funciones, storage, errores y costos |

## Agregar contenido

El contenido está en [`src/content/`](src/content):

- **Una entrada de la biblioteca:** sumar un objeto a `library` en [`library.ts`](src/content/library.ts), con su sección en `kind` (`clase`, `apunte`, `documentacion`, `repositorio`, `skill`, `herramienta`, `lectura` o `comunidad`), título, resumen, etiquetas, links, fecha y semana del programa. Opcionales: `author`, `origin` (repos: `mio`, `comunidad` u `oficial`), `video` (id de YouTube, muestra la miniatura), `order` y `task` (slug de la tarea relacionada). El tipo `Entry` está en [`schema.ts`](src/content/schema.ts).
- **La semana actual:** `site.currentWeek` en `schema.ts`. La portada muestra lo nuevo de esa semana.
- **Una tarea nueva:** sumar un objeto a `tasks` en [`tasks.ts`](src/content/tasks.ts) y crear su carpeta en `src/app/tareas/<slug>/`, con `layout.tsx` (pestañas), `page.tsx` (resumen), `ejecucion/` y `explicacion/`. La de `aex-pass` sirve de plantilla.

Los datos del contrato de Aex Pass (ids, hashes, transacciones, comisiones, errores) están una sola vez en [`src/lib/deployment.ts`](src/lib/deployment.ts); las páginas y la biblioteca los importan de ahí.

Cada push a `main` se publica solo en Vercel.

## Desarrollo

Next.js 16, React 19, Tailwind 4 y `@stellar/stellar-sdk`. La ejecución interactiva corre en el navegador contra Stellar testnet: no hay servidor ni base de datos. El SDK se descarga recién cuando la demo lo usa.

```bash
pnpm install
pnpm dev            # http://127.0.0.1:3000
pnpm check          # lint + typecheck + tests + build: lo mismo que corre CI
pnpm test:testnet   # prueba de integración contra testnet (crea cuentas y despliega; no compra)
```

| Carpeta | Qué hay |
|---|---|
| `src/lib/format.ts` | Montos en stroops (`bigint`), sin números de coma flotante. Con tests |
| `src/lib/stellar.ts` | Todo lo que habla con la red. Una transacción cuenta como hecha solo si la red responde `SUCCESS` |
| `src/lib/aex-pass-contract.ts` | Cliente tipado del contrato, generado con `stellar contract bindings typescript` |
| `src/components/aex-pass/` | La demo interactiva: pasos, sesión en `localStorage` y panel en vivo |

El contrato de la primera tarea vive en [latmontecinos-sketch/aex-pass](https://github.com/latmontecinos-sketch/aex-pass).

---

**Alejandro Tintaya Montecinos** — La Paz, Bolivia · [latmontecinos.vercel.app](https://latmontecinos.vercel.app)
