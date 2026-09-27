import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
      <div className="text-7xl font-black text-brand">404</div>
      <h1 className="mt-4 text-2xl font-extrabold text-navy">This part of the curriculum does not exist</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        The class, subject, module or topic you looked for is not in the programme. Try the Learning Journey to find a
        valid route.
      </p>
      <Link
        href="/curriculum"
        className="mt-8 rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
      >
        Back to the Learning Journey
      </Link>
    </main>
  );
}