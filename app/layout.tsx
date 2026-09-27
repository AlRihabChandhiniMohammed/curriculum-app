import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Edu Alt Tech — Future Skills Curriculum",
  description:
    "Explore the Edu Alt Tech Future Skills journey from Class 1 to Class 10 — an interactive, visual syllabus flow across AI, Coding, Design, STEM, Entrepreneurship and Future Skills.",
};

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-teal-300 text-sm font-bold text-white shadow-sm">
            EA
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-navy">
              Edu Alt Tech
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Future Skills
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-navy"
          >
            Home
          </Link>
          <Link
            href="/curriculum"
            className="rounded-lg px-3 py-2 text-brand transition hover:bg-brand/5 hover:text-brand-dark"
          >
            Learning Journey
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:px-6">
        <p className="font-semibold tracking-wide text-slate-500">
          EDU ALT TECH<span className="mx-2 text-slate-300">·</span>
          Empowering Young Minds Through Future Skills
        </p>
        <p>BATCH → CLASS → SUBJECT → MODULE → TOPIC → LESSON → ACTIVITY → PROJECT → ASSESSMENT</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}