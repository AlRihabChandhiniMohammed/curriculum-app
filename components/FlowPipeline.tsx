import { PIPELINE } from "@/data/curriculum";
import { cx } from "@/lib/utils";

const STAGES: Record<string, string> = {
  BATCH: "bg-slate-100 text-slate-600",
  CLASS: "bg-brand/10 text-brand-dark",
  SUBJECT: "bg-violet-100 text-violet-700",
  MODULE: "bg-teal-100 text-teal-700",
  TOPIC: "bg-rose-100 text-rose-700",
  LESSON: "bg-amber-100 text-amber-700",
  ACTIVITY: "bg-sky-100 text-sky-700",
  PROJECT: "bg-indigo-100 text-indigo-700",
  ASSESSMENT: "bg-emerald-100 text-emerald-700",
};

export default function FlowPipeline() {
  return (
    <div className="hidden items-center gap-1 md:flex">
      {PIPELINE.map((stage, i) => (
        <div key={stage} className="flex items-center gap-1">
          <span
            className={cx(
              "rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap",
              STAGES[stage]
            )}
          >
            {stage}
          </span>
          {i < PIPELINE.length - 1 && <span className="text-[10px] text-slate-400">→</span>}
        </div>
      ))}
    </div>
  );
}