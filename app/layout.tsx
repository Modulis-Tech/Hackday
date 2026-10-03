import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Hacktoberfest Hack Day", description: "Gestion et classement temps réel du Hack Day" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
