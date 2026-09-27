"use client";

import { useState } from "react";
import { SUBJECT_ACCENTS, type Subject } from "@/data/curriculum";
import { cx } from "@/lib/utils";

export default function SubjectsOverview({
  subjects,
  onOpenTopic,
}: {
  subjects: Subject[];
  onOpenTopic: (topicId: string, moduleId: string) => void;
}) {
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  function toggleSubject(id: string) {
    setOpenSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleModule(id: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {subjects.map((s) => {
        const accent = SUBJECT_ACCENTS[s.accent];
        const open = openSubjects.has(s.id);
        return (
          <div key={s.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => toggleSubject(s.id)}
              aria-expanded={open}
              className={cx(
                "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50",
                open && accent.soft
              )}
            >
              <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white", accent.grad)}>
                {s.short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-slate-900">{s.name}</span>
                <span className="block text-xs text-slate-500">
                  {s.modules.length} modules ·{" "}
                  {s.modules.reduce((n, m) => n + m.topics.length, 0)} topics
                </span>
              </span>
              <span
                className={cx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform duration-200",
                  open ? "rotate-45 text-white" : "text-slate-400"
                )}
                style={open ? { background: "var(--brand)" } : {}}
              >
                +
              </span>
            </button>

            {open && (
              <div className="animate-fadeIn border-t border-slate-100 px-5 py-3">
                <p className="pb-3 text-[13px] leading-relaxed text-slate-600">{s.description}</p>
                <div className="space-y-2">
                  {s.modules.map((m) => {
                    const mOpen = openModules.has(m.id);
                    return (
                      <div key={m.id} className="rounded-2xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => toggleModule(m.id)}
                          aria-expanded={mOpen}
                          className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left"
                        >
                          <span className="text-sm font-bold text-slate-800">{m.name}</span>
                          <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                            {m.topics.length} topics
                            <span className={cx("transition-transform duration-200", mOpen && "rotate-180")}>▾</span>
                          </span>
                        </button>
                        {mOpen && (
                          <div className="animate-fadeIn flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3">
                            {m.topics.map((t, i) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => onOpenTopic(t.id, m.id)}
                                className={cx(
                                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:shadow-sm",
                                  indexColor(i, accent)
                                )}
                              >
                                {t.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function indexColor(i: number, accent: { text: string; border: string; soft: string }) {
  return i % 2 === 0
    ? `${accent.border} ${accent.soft} ${accent.text}`
    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300";
}