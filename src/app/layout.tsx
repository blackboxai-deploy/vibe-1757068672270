import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduAI Platform",
  description: "Educational AI Platform for Code Assessment - Innovative tools for professors and students",
  keywords: ["education", "AI", "code assessment", "programming", "learning"],
  authors: [{ name: "EduAI Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans`}
      >
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}