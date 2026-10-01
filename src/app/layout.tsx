import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { CodeBackdrop } from "@/components/code-backdrop";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/schema";
import "./globals.css";

// Tres familias: Archivo ancha para títulos, Plex Sans para leer y
// JetBrains Mono para etiquetas y código.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: `${site.tagline} en ${site.program}: repositorios, apuntes, recursos y tareas.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${plexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="relative isolate flex min-h-full flex-col font-sans">
        <CodeBackdrop />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 sm:px-8">{children}</main>
        <footer className="border-t border-border bg-bg">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 font-mono text-xs uppercase tracking-wider text-muted sm:px-8">
            <span>
              <a href={site.authorUrl} className="text-text underline decoration-dotted underline-offset-4 hover:text-accent">
                {site.author}
              </a>{" "}
              · {site.program}
            </span>
            <a href={site.repo} target="_blank" rel="noreferrer" className="hover:text-accent">
              Código en GitHub ↗
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
