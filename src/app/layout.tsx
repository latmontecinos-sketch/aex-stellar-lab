import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/lab";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: `${site.tagline} en ${site.program}: repositorios, apuntes, recursos y tareas.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted sm:px-8">
            <span>
              {site.name} ·{" "}
              <a href={site.authorUrl} className="text-text hover:text-accent">
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
