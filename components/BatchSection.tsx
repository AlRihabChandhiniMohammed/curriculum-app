import type { Level, ClassCurriculum } from "@/data/curriculum";
import { LEVEL_META } from "@/data/curriculum";
import ClassCard from "@/components/ClassCard";
import { cx } from "@/lib/utils";

export default function BatchSection({
  level,
  classes,
  onlyIds,
  emptyText,
}: {
  level: Level;
  classes: ClassCurriculum[];
  onlyIds?: number[];
  emptyText?: string;
}) {
  const meta = LEVEL_META[level];
  const visible = onlyIds ? classes.filter((c) => onlyIds.includes(c.id)) : classes;
  return (
    <section id={meta.batch.toLowerCase()} className="scroll-mt-24">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${meta.dot}`} />
        <div>
          <h2 className={cx("text-xl font-extrabold tracking-tight sm:text-2xl", meta.text)}>
            {meta.batch}{" "}
            <span className="text-slate-400">(Classes {classes.map((c) => c.id).join(", ")})</span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">{meta.subtitle}</p>
        </div>
      </div>
      {visible.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <ClassCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500">
          {emptyText ?? "No classes match the current filters."}
        </p>
      )}
    </section>
  );
}