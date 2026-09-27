import Link from "next/link";
import { LEVEL_META, type ClassCurriculum } from "@/data/curriculum";

export default function ClassCard({ c }: { c: ClassCurriculum }) {
  const meta = LEVEL_META[c.level];
  return (
    <Link
      href={`/curriculum/class/${c.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div
        className={`hero-tile flex h-28 items-start justify-between bg-gradient-to-br ${c.theme} px-5 pt-4`}
      >
        <div>
          <div className="text-lg font-black tracking-[0.18em] text-white drop-shadow-sm">
            CLASS {c.id}
          </div>
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
            {meta.batch}
          </div>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${meta.chip}`}
        >
          {c.level}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
          <span>{c.stats.subjects} subjects</span>
          <span className="text-slate-300">·</span>
          <span>{c.stats.modules} modules</span>
          <span className="text-slate-300">·</span>
          <span>{c.stats.topics} topics</span>
        </div>
        <p className="text-[13px] leading-relaxed text-slate-600">{c.tagline}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-bold text-brand">
          View Syllabus
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}