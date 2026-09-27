"use client";

import { SUBJECT_ACCENTS, type CurriculumModule } from "@/data/curriculum";
import ProgressIndicator from "@/components/ProgressIndicator";
import { cx, pluralize } from "@/lib/utils";

export default function ModuleCard({
  module: m,
  accentKey,
  active,
  onSelect,
}: {
  module: CurriculumModule;
  accentKey: keyof typeof SUBJECT_ACCENTS;
  active: boolean;
  onSelect: () => void;
}) {
  const accent = SUBJECT_ACCENTS[accentKey];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={active}
      className={cx(
        "flex w-full flex-col gap-2.5 rounded-2xl border-2 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        active ? `${accent.soft} ${accent.border} shadow-md` : "border-slate-200 hover:border-slate-300"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cx(
            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
            accent.chip
          )}
        >
          Module
        </span>
        <span className="text-[11px] font-semibold text-slate-400">{m.time}</span>
      </div>
      <h5 className="font-bold leading-snug text-slate-900">{m.name}</h5>
      <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{m.description}</p>
      <div className="mt-1 space-y-1.5">
        <div className="flex flex-wrap gap-1">
          {m.topics.slice(0, 4).map((t) => (
            <span key={t.id} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {t.name}
            </span>
          ))}
          {m.topics.length > 4 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              +{m.topics.length - 4}
            </span>
          )}
        </div>
        <ProgressIndicator value={m.topics.length} max={Math.max(m.topics.length, 6)} label={pluralize(m.topics.length, "topic")} />
      </div>
    </button>
  );
}