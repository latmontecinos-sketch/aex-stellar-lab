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

Todo el contenido está en [`src/content/lab.ts`](src/content/lab.ts):

- **Una entrada de la biblioteca:** sumar un objeto a `library` con su sección en `kind` (`clase`, `apunte`, `documentacion`, `repositorio`, `skill`, `herramienta`, `lectura` o `comunidad`), título, resumen, etiquetas, links, fecha y semana del programa. Opcionales: `author`, `origin` (repos: `mio`, `comunidad` u `oficial`), `video` (id de YouTube, muestra la miniatura), `order` y `task` (slug de la tarea relacionada).
- **La semana actual:** `site.currentWeek`. La portada muestra lo nuevo de esa semana.
- **Una tarea nueva:** sumar un objeto a `tasks` y crear su carpeta en `src/app/tareas/<slug>/`, con `layout.tsx` (pestañas), `page.tsx` (resumen), `ejecucion/` y `explicacion/`. La de `aex-pass` sirve de plantilla.

Cada push a `main` se publica solo en Vercel.

## Desarrollo

Next.js 16, React 19, Tailwind 4 y `@stellar/stellar-sdk`. La ejecución interactiva corre en el navegador contra Stellar testnet: no hay servidor ni base de datos.

```bash
pnpm install
pnpm dev
pnpm build
node scripts/check.mts   # prueba de humo de src/lib/stellar.ts contra testnet
```

El contrato de la primera tarea vive en [latmontecinos-sketch/aex-pass](https://github.com/latmontecinos-sketch/aex-pass).

---

**Alejandro Tintaya Montecinos** — La Paz, Bolivia · [latmontecinos.vercel.app](https://latmontecinos.vercel.app)
