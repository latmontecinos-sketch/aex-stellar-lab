# Reglas del proyecto

Aex Stellar Lab: Next.js 16 (tiene cambios incompatibles con versiones anteriores; leer la guía en `node_modules/next/dist/docs/` antes de usar una API), React 19 y `@stellar/stellar-sdk` 17, todo contra Stellar **testnet**.

Estas reglas salen de la auditoría del 2026-09-23. Casi todo el código lo escribe Claude Code y estas reglas evitan que se repitan los problemas que encontró.

## Antes de cada commit
- `pnpm check` (lint + typecheck + tests + build) en verde. Si se tocó `src/lib/stellar.ts`, también `pnpm test:testnet`.
- Si se tocó `package.json`: `pnpm install` y confirmar que `pnpm install --frozen-lockfile` pasa, porque Vercel instala así. Versiones exactas (sin `^`) y `next` en el último parche (`pnpm audit`).
- Al mover o borrar código, en el mismo commit se borran las dependencias, configs, comentarios y partes del README que quedan sobrando.

## Stellar
- Una transacción solo cuenta como hecha si la red responde `SUCCESS`; que el SDK no lance error no alcanza. Guardar el hash antes de esperar la confirmación, para poder recuperarla (`resolveTx`).
- Al reintentar, `AlreadyBought` (#2) y `AlreadyUsed` (#4) significan "ya estaba hecho", no error.
- Consultas paginadas del RPC (`getEvents`): seguir el `cursor` y limitar el inicio con `oldestLedger`. Nunca convertir un error o un resultado parcial en "no hay datos": devolver `Read<T>` y mostrar "no se pudo leer".
- Montos siempre en stroops (`bigint`). Lo que escribe el usuario pasa por `parseXlm` (regex estricto, sin reinterpretar) y nunca se parsea dentro del JSX. Los helpers de dinero llevan tests.
- El estado de la demo se deriva de la cadena; localStorage es solo caché. La red es fija en testnet: el código que firma con llaves guardadas en el navegador nunca apunta a mainnet.
- `src/lib/stellar.ts` carga el SDK completo: la interfaz lo importa con `import()` cuando lo necesita, nunca de forma estática en un componente de cliente.
- Si cambia el contrato (repo `aex-pass`), regenerar `src/lib/aex-pass-contract.ts` con `stellar contract bindings typescript` y actualizar `src/lib/deployment.ts`.

## Datos y contenido
- Una sola fuente por dato: ids, hashes, transacciones, comisiones, errores y conteos del contrato viven en `src/lib/deployment.ts`. Antes de escribir un literal, buscarlo con grep. El README enlaza, no copia cifras.
- Contenido en `src/content/`: `library.ts` (entradas), `tasks.ts` (tareas) y `schema.ts` (tipos y config). Un componente de cliente no importa `library.ts`.
- Ninguna página de contenido lee `searchParams` en el servidor: los filtros se leen con `useSearchParams` dentro de `<Suspense>`, así la página sigue estática.

## Código
- Nada de `any`, `as` para callar al compilador, `!` ni `@ts-ignore`. Nada de `catch {}` sin un comentario que explique por qué ignorar el error es correcto.
- Un test afirma exactamente lo que dice su nombre. Un script sin `assert` no es un test.
- Los comentarios explican el código actual, no su historia.
- `next.config.ts` mantiene la CSP: si la página necesita hablar con un servidor nuevo, se agrega a `connect-src` a propósito.
