import Link from "next/link";
import { curriculumData, PIPELINE } from "@/data/curriculum";

export default function Home() {
  const totalTopics = curriculumData.reduce((s, c) => s + c.stats.topics, 0);
  const totalModules = curriculumData.reduce((s, c) => s + c.stats.modules, 0);
  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(14,143,134,0.14) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-bold text-brand-dark">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
              Edu Alt Tech · Future Skills Curriculum
            </div>
          </div>
          <h1 className="animate-fadeUp delay-100 mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-navy sm:text-6xl">
            Empowering Young Minds Through <span className="text-brand">Future Skills</span>
          </h1>
          <p className="animate-fadeUp delay-150 mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            A full learning journey from Class 1 to Class 10 — Artificial Intelligence, Coding, Digital Design, STEM,
            Entrepreneurship and Future Skills. Follow the flow from{" "}
            <span className="font-semibold text-slate-800">Batch → Class → Subject → Module → Topic</span> all the way
            down to lessons, activities, projects and assessment.
          </p>
          <div className="animate-fadeUp delay-200 mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/curriculum"
              className="rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Explore the Learning Journey →
            </Link>
            <div className="flex gap-3 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-white px-3 py-2 shadow-sm">{curriculumData.length} classes</span>
              <span className="rounded-full bg-white px-3 py-2 shadow-sm">{totalModules}+ modules</span>
              <span className="rounded-full bg-white px-3 py-2 shadow-sm">{totalTopics}+ topics</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 whitespace-nowrap">
            {PIPELINE.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span
                  className={
                    i === 0
                      ? "rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-black tracking-widest text-white"
                      : i === PIPELINE.length - 1
                        ? "rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black tracking-widest text-emerald-700"
                        : "rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-500"
                  }
                >
                  {stage}
                </span>
                {i < PIPELINE.length - 1 && <span className="text-xs text-brand">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Four levels. One continuous journey.</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Classes 1–2 build playful foundations, 3–5 explore real skills, 6–7 build real things, and 8–10 ship products
          and pitch them like founders.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {curriculumData
            .filter((_, i) => [0, 2, 5, 7].includes(i))
            .map((c) => (
              <Link key={c.id} href={`/curriculum/class/${c.id}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className={`h-2.5 bg-gradient-to-r ${c.theme}`} />
                <div className="p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {c.level.charAt(0) + c.level.slice(1).toLowerCase()}
                  </div>
                  <div className="mt-1 text-3xl font-black text-slate-900">Class {c.id}</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{c.tagline}</p>
                  <div className="mt-4 text-sm font-bold text-brand">
                    Explore
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"> →</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}