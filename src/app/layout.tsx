import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Registro de sesiones",
  description: "Registro de sesiones de apoyo escolar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <h1>
            <Link href={ROUTES.home}>Registro de sesiones</Link>
          </h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
