import { cx } from "@/lib/utils";

export default function ProgressIndicator({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        {label ? <span>{label}</span> : null}
        <span className="font-semibold text-slate-700">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={cx("h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}