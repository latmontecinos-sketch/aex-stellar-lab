"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/guia", label: "Guía" },
  { href: "/tareas", label: "Tareas" },
  { href: "/kosmovia", label: "Kosmovia" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span aria-hidden className="h-3.5 w-3.5 bg-accent" />
          <span className="font-display text-base font-extrabold uppercase tracking-wide [font-stretch:125%]">Aex</span>
          <span className="hidden font-mono text-xs text-muted sm:inline">/stellar-lab</span>
        </Link>
        <nav aria-label="Principal">
          <ul className="flex gap-4 font-mono text-[11px] uppercase tracking-wider sm:gap-7 sm:text-xs">
            {NAV.map((item) => (
              // En el teléfono el logo ya lleva al inicio, y así entran todas.
              <li key={item.href} className={item.href === "/" ? "hidden sm:block" : undefined}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`inline-flex h-14 items-center border-b-2 transition-colors ${
                    isActive(item.href) ? "border-accent text-text" : "border-transparent text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
