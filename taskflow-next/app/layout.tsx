import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import LogoutButton from "./components/LogoutButton";
import "./globals.css";

const font = Inter({
  subsets: ["latin"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Gestion de projets collaboratifs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const user = session ? (JSON.parse(session.value) as { name?: string }) : null;

  return (
    <html lang="fr" className={font.variable}>
      <body className={font.className}>
        <header className="tf-header">
          <div className="tf-header-inner">
            <h2 className="tf-brand">TaskFlow</h2>
            <div className="tf-header-actions">
              <nav className="tf-nav" aria-label="Principal">
                <a href="/dashboard">Dashboard</a>
              </nav>
              {user && <span className="tf-user">{user.name}</span>}
              {user && <LogoutButton />}
              {!user && (
                <nav className="tf-nav">
                  <a href="/login">Login</a>
                </nav>
              )}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
