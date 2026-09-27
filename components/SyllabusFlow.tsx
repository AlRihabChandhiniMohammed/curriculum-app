"use client";

import { SUBJECT_ACCENTS, type Subject } from "@/data/curriculum";
import SubjectCard from "@/components/SubjectCard";
import ModuleCard from "@/components/ModuleCard";
import TopicCard from "@/components/TopicCard";
import { cx } from "@/lib/utils";

function StageLabel({
  label,
  accent,
  active,
  onClick,
}: {
  label: string;
  accent?: keyof typeof SUBJECT_ACCENTS;
  active?: boolean;
  onClick?: () => void;
}) {
  const a = accent ? SUBJECT_ACCENTS[accent] : null;
  const button = !!onClick;
  const cls = cx(
    "flex items-center gap-2 rounded-2xl border-2 bg-white px-4 py-2.5 shadow-sm",
    active ? `${a?.border ?? "border-brand"} ring-2 ${a?.soft ?? "bg-brand/5"}` : "border-slate-200",
    button && "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
  );
  const inner = (
    <>
      <span
        className={cx(
          "h-2.5 w-2.5 rounded-full",
          accent ? a?.dot : "bg-slate-400"
        )}
      />
      <span className={cx("text-xs font-black uppercase tracking-[0.18em]", accent ? a?.text : "text-slate-700")}>
        {label}
      </span>
    </>
  );
  return button ? (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function SyllabusFlow({
  subjects,
  selSubject,
  selModule,
  onSelectSubject,
  onSelectModule,
  onDeselectSubject,
  onDeselectModule,
  onOpenTopic,
}: {
  subjects: Subject[];
  selSubject: string | null;
  selModule: string | null;
  onSelectSubject: (id: string) => void;
  onSelectModule: (id: string) => void;
  onDeselectSubject: () => void;
  onDeselectModule: () => void;
  onOpenTopic: (topicId: string, moduleId: string) => void;
}) {
  const subject = selSubject ? subjects.find((s) => s.id === selSubject) : null;
  const mod = subject && selModule ? subject.modules.find((m) => m.id === selModule) : null;

  return (
    <div className="flex flex-col items-stretch">
      <div className="flow-connector" aria-hidden />
      <StageLabel label="Class" onClick={undefined} />
      <div className="flow-connector" aria-hidden />

      <div className="animate-fadeUp rounded-3xl border border-slate-200 bg-white/70 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <StageLabel label="Subjects" active={!!subject} onClick={selSubject ? onDeselectSubject : undefined} />
          <span className="text-xs font-semibold text-slate-400">{subjects.length} subjects</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              subject={s}
              active={selSubject === s.id}
              onToggle={() => onSelectSubject(s.id)}
            />
          ))}
        </div>
      </div>

      {subject && (
        <>
          <div className="flow-connector" aria-hidden />
          <div className="animate-fadeUp rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <StageLabel label="Modules" accent={subject.accent} active={!!mod} onClick={selModule ? onDeselectModule : undefined} />
              <div className="flex items-center gap-2">
                <span
                  className={cx(
                    "rounded-2xl px-2.5 py-1 text-[11px] font-bold",
                    SUBJECT_ACCENTS[subject.accent].chip
                  )}
                >
                  {subject.name}
                </span>
                <span className="text-xs font-semibold text-slate-400">{subject.modules.length} modules</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {subject.modules.map((m) => (
                <ModuleCard
                  key={m.id}
                  module={m}
                  accentKey={subject.accent}
                  active={selModule === m.id}
                  onSelect={() => onSelectModule(m.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {subject && mod && (
        <>
          <div className="flow-connector" aria-hidden />
          <div className="animate-fadeUp rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <StageLabel label="Topics" accent={subject.accent} active />
              <div className="flex items-center gap-2">
                <span className={cx("rounded-2xl px-2.5 py-1 text-[11px] font-bold", SUBJECT_ACCENTS[subject.accent].chip)}>
                  {subject.name}
                </span>
                <span className="rounded-2xl bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  {mod.name}
                </span>
                <span className="text-xs font-semibold text-slate-400">{mod.topics.length} topics</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mod.topics.map((t, i) => (
                <TopicCard
                  key={t.id}
                  topic={t}
                  accentKey={subject.accent}
                  index={i}
                  onOpen={() => onOpenTopic(t.id, mod.id)}
                />
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Module project</span>
                <p className="mt-1 text-sm font-semibold text-emerald-900">{mod.project}</p>
              </div>
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Module assessment</span>
                <p className="mt-1 text-sm font-semibold text-indigo-900">{mod.assessment}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}