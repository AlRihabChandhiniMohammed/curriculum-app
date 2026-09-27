import { SUBJECT_ACCENTS, type ClassCurriculum } from "@/data/curriculum";

export default function ProjectsView({ c }: { c: ClassCurriculum }) {
  const p = c.project;
  return (
    <div className="animate-fadeUp space-y-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className={`hero-tile bg-gradient-to-br ${c.theme} px-6 py-8 text-white`}>
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/75">Class {c.id} flagship project</div>
          <h3 className="mt-1 text-2xl font-extrabold">{p.name}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">{p.description}</p>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Deliverables</h4>
            <ul className="space-y-2">
              {p.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Expected outcome</h4>
            <p className="text-sm font-semibold leading-relaxed text-emerald-900">{p.outcome}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4 flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          Every module ends with a build
        </h4>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {c.subjects.map((s) =>
            s.modules.map((m) => (
              <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${SUBJECT_ACCENTS[s.accent].dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.name}</span>
                </div>
                <h5 className="mt-1.5 text-sm font-bold text-slate-900">{m.name}</h5>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{m.project}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
        <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700">Assessment rhythm</h4>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-indigo-900">
          Every module closes with a targeted assessment, every topic includes in-class checks and practice, and the year
          ends with the flagship project above. Exploring any topic in the syllabus flow shows its activity, project and
          assessment at the topic level.
        </p>
      </div>
    </div>
  );
}