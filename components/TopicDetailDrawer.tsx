"use client";

import { useEffect, useRef } from "react";
import { SUBJECT_ACCENTS, type Topic } from "@/data/curriculum";
import { cx } from "@/lib/utils";

function Section({ label, items, tone }: { label: string; items: string[]; tone?: string }) {
  return (
    <section>
      <h5 className={cx("mb-2 text-[10px] font-black uppercase tracking-[0.18em]", tone ?? "text-slate-500")}>
        {label}
      </h5>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TopicDetailDrawer({
  topic,
  accentKey,
  context,
  onClose,
}: {
  topic: Topic | null;
  accentKey?: keyof typeof SUBJECT_ACCENTS;
  context?: { subject?: string; module?: string };
  onClose: () => void;
}) {
  const open = !!topic;
  const ref = useRef<HTMLDivElement>(null);
  const accent = accentKey ? SUBJECT_ACCENTS[accentKey] : null;

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <div
      className={cx(
        "fixed inset-0 z-50 flex justify-end",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={cx(
          "absolute inset-0 bg-navy/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={ref}
        className={cx(
          "topic-drawer relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl",
          open && "open"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className={cx("flex items-center justify-between gap-3 bg-gradient-to-br px-5 py-4 text-white", accent?.grad ?? "from-brand to-brand-dark")}>
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Topic detail</div>
            <h3 className="truncate text-lg font-extrabold">{topic?.name}</h3>
            {context && (
              <p className="truncate text-xs text-white/75">
                {context.subject} · {context.module}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-bold transition-colors hover:bg-white/30"
            aria-label="Close drawer"
          >
            ×
          </button>
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
          {topic ? (
            <div className="animate-fadeUp space-y-6">
              <p className="text-sm leading-relaxed text-slate-600">{topic.description}</p>

              <div className={cx("rounded-2xl border p-4", accent ? `${accent.border} ${accent.soft}` : "border-slate-200 bg-slate-50")}>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Learning objective</div>
                <p className={cx("mt-1 text-[13px] font-semibold", accent?.text ?? "text-slate-800")}>{topic.objective}</p>
              </div>

              <Section label="Subtopics" items={topic.subtopics} tone={accent?.text} />
              <Section label="Activities" items={topic.activities} tone={accent?.text} />
              <Section label="Practice" items={topic.practice} tone={accent?.text} />

              <div className={cx("rounded-2xl border p-4", accent ? `${accent.border} ${accent.soft}` : "border-slate-200 bg-slate-50")}>
                <div className={cx("text-[10px] font-black uppercase tracking-[0.18em]", accent?.text ?? "text-slate-500")}>Activity project</div>
                <p className="mt-1 text-[13px] font-semibold text-slate-800">{topic.project}</p>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">Assessment</div>
                <p className="mt-1 text-[13px] font-semibold text-indigo-900">{topic.assessment}</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Expected outcome</div>
                <p className="mt-1 text-[13px] font-semibold text-emerald-900">{topic.outcome}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Select a topic to see its full lesson detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}