"use client";

import { SUBJECT_ACCENTS, type Subject } from "@/data/curriculum";
import { cx } from "@/lib/utils";

export default function SubjectCard({
  subject,
  active,
  onToggle,
}: {
  subject: Subject;
  active: boolean;
  onToggle: () => void;
}) {
  const accent = SUBJECT_ACCENTS[subject.accent];
  const topics = subject.modules.reduce((s, m) => s + m.topics.length, 0);
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={active}
      className={cx(
        "group flex w-full flex-col gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        active ? `${accent.border} shadow-md ring-2 ${accent.soft}` : "border-slate-200 hover:border-slate-300"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cx(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white",
            accent.grad
          )}
        >
          {subject.short}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-bold text-slate-900">{subject.name}</h4>
            {subject.optional && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                Optional
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {subject.modules.length} modules · {topics} topics
          </p>
        </div>
        <span
          className={cx(
            "ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform duration-200",
            active ? "rotate-45 text-white" : "text-slate-400"
          )}
          style={active ? { background: "var(--brand)" } : {}}
        >
          +
        </span>
      </div>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{subject.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {subject.modules.map((m) => (
          <span
            key={m.id}
            className={cx("rounded-full px-2 py-0.5 text-[10px] font-semibold", accent.chip)}
          >
            {m.name}
          </span>
        ))}
      </div>
    </button>
  );
}