"use client";

import { useEffect, useRef } from "react";

// Lo que cae son piezas de mis propios contratos (Aex Pass y el RWA Launchpad)
// y de los comandos del CLI, letra por letra, de arriba hacia abajo.
const TOKENS = [
  "require_auth()",
  "AmountTooLow",
  "check_in",
  "invest(500)",
  "set_whitelist",
  "MIN_INVESTMENT",
  "extend_ttl",
  "PassStatus::Used",
  "Error(Contract,#7)",
  "soroban_sdk",
  "i128",
  "Address",
  "panic_with_error!",
  "stellar contract invoke",
  "fn buy()",
  "checked_in",
  "AlreadyUsed",
  "token.transfer",
  "Env",
  "testnet",
];

const FONT_SIZE = 22;
const LINE = FONT_SIZE + 6;
const COLUMN_WIDTH = 34;
// La lluvia es lenta: a más de 24 fps no se ve distinta y gasta más batería.
const FPS = 24;
const FRAME_MS = 1000 / FPS;

type Column = { y: number; speed: number; token: string };

function randomToken() {
  return TOKENS[Math.floor(Math.random() * TOKENS.length)];
}

/**
 * Lluvia de código detrás del contenido. Se dibuja con alpha bajo para que el
 * texto de encima siga legible, avanza según el tiempo (no según los cuadros),
 * se detiene con la pestaña oculta y no arranca si el sistema pide menos
 * movimiento.
 */
export function CodeBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    let width = 0;
    let height = 0;
    let columns: Column[] = [];
    let raf = 0;
    let last = 0;
    let running = document.visibilityState === "visible";

    const readInk = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        ink: styles.getPropertyValue("--muted").trim(),
        accent: styles.getPropertyValue("--accent").trim(),
        // El gris sobre concreto claro rinde menos que sobre grafito.
        boost: scheme.matches ? 1 : 1.35,
      };
    };
    let colors = readInk();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Cambiar el tamaño del canvas reinicia su estado: la fuente se fija aquí.
      const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim();
      ctx.font = `500 ${FONT_SIZE}px ${mono || "ui-monospace"}, ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      columns = Array.from({ length: Math.ceil(width / COLUMN_WIDTH) }, () => ({
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 0.9,
        token: randomToken(),
      }));
    };

    const draw = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      const elapsed = now - last;
      if (elapsed < FRAME_MS) return;
      // Pasos equivalentes a 60 fps, con tope por si la pestaña estuvo congelada.
      const steps = Math.min(elapsed / (1000 / 60), 10);
      last = now;
      ctx.clearRect(0, 0, width, height);

      columns.forEach((column, index) => {
        const x = index * COLUMN_WIDTH + COLUMN_WIDTH / 2;
        const length = column.token.length;
        column.y += column.speed * steps;
        if (column.y - length * LINE > height) {
          column.y = -Math.random() * height * 0.5;
          column.token = randomToken();
        }
        // La última letra dibujada va abajo, en el acento, y el resto se apaga hacia arriba.
        for (let i = 0; i < length; i++) {
          const y = column.y - (length - 1 - i) * LINE;
          if (y < -LINE || y > height) continue;
          const fromHead = length - 1 - i;
          ctx.globalAlpha = (fromHead === 0 ? 0.5 : Math.max(0.3 - fromHead * 0.018, 0.08)) * colors.boost;
          ctx.fillStyle = fromHead === 0 ? colors.accent : colors.ink;
          ctx.fillText(column.token[i], x, y);
        }
      });
      ctx.globalAlpha = 1;
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(draw);
    };
    const onScheme = () => {
      colors = readInk();
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    scheme.addEventListener("change", onScheme);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      scheme.removeEventListener("change", onScheme);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Atenúa la lluvia en la columna de lectura; en los bordes se ve completa. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_75%_at_center,color-mix(in_srgb,var(--bg)_72%,transparent)_45%,transparent_100%)]" />
    </div>
  );
}
