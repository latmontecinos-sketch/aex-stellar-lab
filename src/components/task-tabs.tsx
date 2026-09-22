"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TaskTabs({ base, tabs }: { base: string; tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Secciones de la tarea" className="border-b border-border">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const href = `${base}${tab.href}`;
          const active = pathname === href;
          return (
            <li key={tab.href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-11 items-center whitespace-nowrap border-b-2 px-4 text-sm transition-colors ${
                  active ? "border-accent font-medium text-accent" : "border-transparent text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
