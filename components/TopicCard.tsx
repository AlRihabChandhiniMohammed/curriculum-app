"use client";

import { SUBJECT_ACCENTS, type Topic } from "@/data/curriculum";
import { cx } from "@/lib/utils";

export default function TopicCard({
  topic,
  accentKey,
  index,
  onOpen,
}: {
  topic: Topic;
  accentKey: keyof typeof SUBJECT_ACCENTS;
  index: number;
  onOpen: () => void;
}) {
  const accent = SUBJECT_ACCENTS[accentKey];
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cx(
        "group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        index % 2 === 0 ? "animate-fadeUp" : "animate-fadeUp delay-50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cx("text-[10px] font-bold uppercase tracking-wider", accent.text)}>
          Topic {String(index + 1).padStart(2, "0")}
        </span>
        <span className={cx("h-2 w-2 rounded-full", accent.dot)} />
      </div>
      <h6 className="font-bold leading-snug text-slate-900">{topic.name}</h6>
      <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{topic.objective}</p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
          {topic.subtopics.length} subtopics
        </span>
        <span className={cx("text-xs font-bold transition-transform duration-200 group-hover:translate-x-0.5", accent.text)}>
          Details →
        </span>
      </div>
    </button>
  );
}