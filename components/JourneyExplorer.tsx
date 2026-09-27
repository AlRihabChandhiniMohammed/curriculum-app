"use client";

import { useMemo, useState } from "react";
import { LEVEL_META, type ClassCurriculum, type Level } from "@/data/curriculum";
import BatchSection from "@/components/BatchSection";
import CurriculumSearch from "@/components/CurriculumSearch";
import { cx } from "@/lib/utils";

const LEVEL_ORDER: Level[] = ["FOUNDATION", "EXPLORER", "BUILDER", "ADVANCED"];

export default function JourneyExplorer({ classes }: { classes: ClassCurriculum[] }) {
  const [batch, setBatch] = useState<"all" | Level>("all");
  const [subject, setSubject] = useState<string>("all");
  const [activeClass, setActiveClass] = useState<number | null>(null);

  const subjectNames = useMemo(() => {
    const set = new Set<string>();
    for (const c of classes) for (const s of c.subjects) set.add(s.name);
    return Array.from(set).sort();
  }, [classes]);

  const filteredIds = useMemo(() => {
    return classes
      .filter((c) => {
        if (batch !== "all" && c.level !== batch) return false;
        if (activeClass !== null && c.id !== activeClass) return false;
        if (subject !== "all" && !c.subjects.some((s) => s.name === subject)) return false;
        return true;
      })
      .map((c) => c.id);
  }, [classes, batch, subject, activeClass]);

  const hasFilter = batch !== "all" || subject !== "all" || activeClass !== null;
  const noneVisible = filteredIds.length === 0;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <CurriculumSearch />
        </div>

        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batch / Level</span>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value as "all" | Level)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-brand"
            >
              <option value="all">All batches &amp; levels</option>
              {LEVEL_ORDER.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_META[l].batch} ({l})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-brand"
            >
              <option value="all">All subjects</option>
              {subjectNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Jump to class</span>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveClass(activeClass === c.id ? null : c.id)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                  activeClass === c.id
                    ? "border-brand bg-brand text-white shadow-md"
                    : "border-slate-300 bg-white text-slate-600 hover:border-brand hover:text-brand"
                )}
              >
                Class {c.id}
              </button>
            ))}
          </div>
        </div>

        {hasFilter && (
          <div className="flex items-center justify-between rounded-2xl bg-brand/5 px-4 py-3">
            <p className="text-sm font-semibold text-brand-dark">
              {noneVisible ? "No classes match the filters." : `${filteredIds.length} class${filteredIds.length === 1 ? "" : "es"} match the current filters.`}
            </p>
            <button
              type="button"
              onClick={() => {
                setBatch("all");
                setSubject("all");
                setActiveClass(null);
              }}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-dark shadow-sm transition-transform hover:scale-105"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 space-y-14">
        {LEVEL_ORDER.map((lvl) => (
          <BatchSection
            key={lvl}
            level={lvl}
            classes={classes.filter((c) => c.level === lvl)}
            onlyIds={filteredIds}
            emptyText={hasFilter ? `No classes match the filters in the ${LEVEL_META[lvl].batch} batch.` : undefined}
          />
        ))}
      </div>
    </div>
  );
}